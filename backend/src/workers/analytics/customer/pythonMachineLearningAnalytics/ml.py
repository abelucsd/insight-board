import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from typing import List


def kmeans(df: pd.DataFrame, features: List[str]) -> pd.DataFrame:
  # Scale the features.
  # Scaling removes the indices.
  scaler = StandardScaler()
  scaled_feature_matrix = scaler.fit_transform(df)

  # Run k-means on the full feature matrix.  
  kmeans = KMeans(n_clusters=3, random_state=42)
  kmeans.fit(scaled_feature_matrix)

  # Preprocess to visualize
  # Add back the indices and add the cluster column.
  scaled_feature_matrix = pd.DataFrame(scaled_feature_matrix, columns=features, index=df.index)
  scaled_feature_matrix['cluster'] = kmeans.labels_  

  # Analysis on the clustered feature matrix.
  # Heatmap
  cluster_means = scaled_feature_matrix.groupby('cluster').mean()

  pca = PCA(n_components=2)
  proj = pca.fit_transform(scaled_feature_matrix)
  pca_df = pd.DataFrame(proj, columns=['PC1', 'PC2'])
  pca_df['cluster'] = kmeans.labels_

  return scaled_feature_matrix