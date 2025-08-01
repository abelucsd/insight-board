import csv
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import json
import sys
import certifi
from datetime import datetime
from pymongo import MongoClient
from helpers import convert_json_serializable_doc, coerce_date_column_types, coerce_numerical_column_types, create_customer_feature_matrix
from ml import kmeans


def run_ml_analysis(mongo_uri, db_name, analysis_type):  
   try:      
      client = MongoClient(mongo_uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=3000)
      client.admin.command('ping')

      db = client[db_name]      

      collection = db['invoices']      
      
      invoices_cursor = collection.find({})            
      invoices_documents = list(invoices_cursor)            
      clean_inv_docs = [convert_json_serializable_doc(doc) for doc in invoices_documents]
      
      df = pd.DataFrame(clean_inv_docs)
      
      # Preprocess      
      numerical_columns = ['price', 'quantity', 'revenue', 'cost', 'profit']
      date_columns = ['date']      
      df = coerce_numerical_column_types(numerical_columns, df)
      df = coerce_date_column_types(date_columns, df)

      # Engineer the Features      
      feature_matrix = create_customer_feature_matrix(df)      

      # Apply Kmeans algorithm      
      features = ['total_spend', 'num_purchases', 'recency', 'avg_purchase', 'frequency']
      cluster_matrix_df = kmeans(feature_matrix, features)      

      # Apply business tags to customers
      # 3 Groups: Spend, Recency, Frequency
      # Each group divided into 3 categories: High, Normal, Low      
      cluster_means = cluster_matrix_df.groupby('cluster').mean()  

      # Add customer id as a column in the cluster_matrix_df to apply business tags to customers
      cluster_matrix_df = cluster_matrix_df.reset_index()
      
      # Spend
      sorted_spend_cluster = cluster_means.sort_values(by='total_spend', ascending=True)
      high_spend_cluster = sorted_spend_cluster.index[-1]
      low_spend_cluster = sorted_spend_cluster.index[0]
      normal_spend_cluster = sorted_spend_cluster.index[1:-1]
      
      # Apply business tags to customers

      high_spenders, normal_spenders, low_spenders = [], [], []
      high_spenders = cluster_matrix_df[cluster_matrix_df['cluster'] == high_spend_cluster]    
      normal_spenders = cluster_matrix_df[cluster_matrix_df['cluster'].isin(normal_spend_cluster)]
      low_spenders = cluster_matrix_df[cluster_matrix_df['cluster'] == low_spend_cluster]  
      
      sorted_recency_cluster = cluster_means.sort_values(by='recency', ascending=True)
      high_recency_cluster = sorted_recency_cluster.index[-1]
      normal_recency_cluster = sorted_recency_cluster.index[1:-1]
      low_recency_cluster = sorted_recency_cluster.index[0]

      high_recencies, normal_recencies, low_recencies = [], [], []
      high_recencies = cluster_matrix_df[cluster_matrix_df['cluster'] == high_recency_cluster]
      normal_recencies = cluster_matrix_df[cluster_matrix_df['cluster'].isin(normal_recency_cluster)]
      low_recencies = cluster_matrix_df[cluster_matrix_df['cluster'] == low_recency_cluster]

      sorted_frequency_cluster = cluster_means.sort_values(by='frequency', ascending=True)
      high_frequency_cluster = sorted_frequency_cluster.index[-1]
      low_frequency_cluster = sorted_frequency_cluster.index[0]
      normal_frequency_cluster = sorted_frequency_cluster[1:-1]

      high_frequencies, normal_frequencies, low_frequencies = [], [], []
      high_frequencies = cluster_matrix_df[cluster_matrix_df['cluster'] == high_frequency_cluster]
      normal_frequencies = cluster_matrix_df[cluster_matrix_df['cluster'].isin(normal_frequency_cluster)]
      low_frequencies = cluster_matrix_df[cluster_matrix_df['cluster'] == low_frequency_cluster]
      
      # nodejs will read the result via stdout
      result = {
         'spend': {
            'high': high_spenders.to_dict(orient='records'),
            'normal': normal_spenders.to_dict(orient='records'), 
            'low': low_spenders.to_dict(orient='records')},
         'recency': {
            'high': high_recencies.to_dict(orient='records'), 
            'normal': normal_recencies.to_dict(orient='records'), 
            'low': low_recencies.to_dict(orient='records')},
         'frequency': {
            'high': high_frequencies.to_dict(orient='records'), 
            'normal': normal_frequencies.to_dict(orient='records'), 
            'low': low_frequencies.to_dict(orient='records')},
      }      

      return result 
   except Exception as e:
      print(f"ERROR: {str(e)}", file=sys.stderr)
      sys.exit(1)

if __name__ == '__main__':  
   if len(sys.argv) < 4:
      print(f"ERROR: Insufficient number of arguments passed to the python script.", file=sys.stderr)
      sys.exit(1)
   try:
      mongo_uri = sys.argv[1]
      db_name = sys.argv[2]
      analysis_type = sys.argv[3]

      match analysis_type:
         case 'customer-behavior':
            result = run_ml_analysis(mongo_uri, db_name, analysis_type)            
            print(json.dumps(result), flush=True)
         case 'behavior':
            result = run_ml_analysis(mongo_uri, db_name, analysis_type)
            print(json.dumps(result))
         case 'customer-behavior':
            result = run_ml_analysis(mongo_uri, db_name, analysis_type)            
            print(json.dumps(result), flush=True)
            sys.exit(0)
         case _:
            sys.exit(1)            
      
   except Exception as e:
      print(f"ERROR: {str(e)}", file=sys.stderr)
      sys.exit(1)