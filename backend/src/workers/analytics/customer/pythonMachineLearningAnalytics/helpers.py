from typing import List
import pandas as pd
from datetime import datetime
from bson import ObjectId

'''
General document to json converter.
'''
def convert_json_serializable_doc(doc):
  new_doc = {}
  for k, v in doc.items():
    if isinstance(v, ObjectId):
      new_doc[k] = str(v)
    elif isinstance(v, datetime):
      new_doc[k] = v.isoformat()
    else:
      new_doc[k] = v
  return new_doc

'''
  Preprocess a table to produces a feature matrix.
  params:
    - features - attributes associated to numerical values
    - df - the table to preprocess into a feature matrix.
    - date_features? - features associated to date values.
    - has_date? - flag for preprocessing boolean columns.
  return:
    - feature_matrix: List[List[int]] - the feature_matrix
'''
def create_feature_matrix2(
      features: List[str], 
      df: List[List[any]],
      date_features: List[str] = None,
      has_date: bool = False):
    
    # 1. Preprocess the dataframe
    # ensure the values associated to the features are numerical
    for feat in features:
      df[feat] = df[feat].astype(float)

    # check if Date is provided
    if has_date:
       for feat in date_features:
          df[feat] = pd.to_datetime(df[feat])
    
    # 2. Engineer the features


def coerce_numerical_column_types(columns: List[str], df: pd.DataFrame) -> pd.DataFrame:
    for col in columns:
      df[col] = df[col].astype(float)
    return df

def coerce_date_column_types(columns: List[str], df: pd.DataFrame) -> pd.DataFrame:
    for col in columns:
       df[col] = pd.to_datetime(df[col])
    return df

'''
  Tightly coupled to the parent function.
  Preprocess a table to produces a feature matrix.
  params:    
    - df - the dataframe to preprocess into a feature matrix.    
  return:
    - feature_matrix: pd.DataFrame - the feature_matrix
'''
def create_customer_feature_matrix(df: pd.DataFrame) -> pd.DataFrame:
  # Engineer the features
  # Features:
  # total_spend: The total amount spent by a customer.
  # num_purchase: The number of invoices associated with the customer.
  # recency: How many days ago was the customer's last invoice.
  # average_purchase: Average value of a single purchase
  # frequency: How often the customer buys

  # Revenue is a customer's total purchase amount.
  # total_spend
  total_spend_series = df.groupby('Customer Id')['Revenue'].sum()
  # total_spend_array = total_spend_series.reindex(unique_customers).values

  # num_purchase
  num_purchase_series = df.groupby('Customer Id').size()

  # recency
  latest_invoice_series = df.groupby('Customer Id')['Date'].max()
  recency_series = (datetime.today() - latest_invoice_series).dt.days

  # average_purchase
  average_purchase_series = df.groupby('Customer Id')['Revenue'].mean()

  # frequency
  # first to last invoice
  first_invoice_series = df.groupby('Customer Id')['Date'].min()
  last_invoice_series = df.groupby('Customer Id')['Date'].max()
  customer_lifetime_days_series = (last_invoice_series - first_invoice_series).dt.days + 1
  frequency_series = num_purchase_series / customer_lifetime_days_series

  # feature matrix
  feature_matrix = pd.concat([
    total_spend_series,
    num_purchase_series,
    recency_series,
    average_purchase_series,
    frequency_series
  ], axis=1)
  feature_matrix.columns = ['total_spend', 'num_purchases', 'recency', 'average_purchase', 'frequency']


  # 3. Return the feature matrix  

  return feature_matrix