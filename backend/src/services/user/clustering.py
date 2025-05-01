import matplotlib

matplotlib.use("Agg")

import os, io, pickle
import numpy as np

import matplotlib.pyplot as plt
from fastapi.responses import StreamingResponse
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
from typing import Dict, Any, Optional
from src.constants import BASE_DIR


def get_latest_cluster_dir(user_id: int) -> Optional[str]:
    base_dir = os.path.join(BASE_DIR, "media", "users", "faces", str(user_id))
    if not os.path.exists(base_dir):
        return None
    video_dirs = sorted(os.listdir(base_dir), reverse=True)
    for vid in video_dirs:
        cluster_dir = os.path.join(base_dir, vid, "clusters")
        if os.path.exists(os.path.join(cluster_dir, "centroids.pkl")):
            return cluster_dir
    return None


def cluster_raw_vectors(raw: list[np.ndarray], n_clusters: int = 6) -> dict:
    # 사용자 등록 데이터가 임계치(5개 이상)을 넘어가면 클러스터링 수행
    X = np.array(raw)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(X)
    return {
        "centroids": kmeans.cluster_centers_.tolist(),  # 각 클러스터의 중심 벡터
        "labels": kmeans.labels_.tolist(),  # 각 벡터가 어떤 클러스터에 속하는지 (0, 1, 2 등)
    }


# 클러스터링 시각화
def visualize_clusters(user_id: int):
    cluster_dir = get_latest_cluster_dir(user_id)
    if not cluster_dir:
        return "사용자의 클러스터링 결과가 존재하지 않습니다."

    # 1. 중심 벡터 로딩
    with open(os.path.join(cluster_dir, "centroids.pkl"), "rb") as f:
        centroids = pickle.load(f)  # List[np.ndarray]

    # 2. 클러스터별 벡터 로딩
    raw = []
    labels = []
    for i in range(len(centroids)):
        path = os.path.join(cluster_dir, f"cluster_{i}.pkl")
        if os.path.exists(path):
            with open(path, "rb") as f:
                vecs = pickle.load(f)
                raw.extend(vecs)
                labels.extend([i] * len(vecs))

    if not raw:
        return "벡터 데이터가 없습니다."

    raw = np.array(raw)
    centroids = np.array(centroids)

    combined = np.vstack([raw, centroids])
    perp = max(2, min(30, (len(combined) - 1) // 3))
    emb2d = TSNE(n_components=2, random_state=42, perplexity=perp).fit_transform(
        combined
    )
    tsne = TSNE(n_components=2, random_state=42, perplexity=perp)

    raw2d = emb2d[: len(raw)]
    cent2d = emb2d[len(raw) :]

    # 시각화
    plt.figure(figsize=(8, 6))
    plt.scatter(
        raw2d[:, 0],
        raw2d[:, 1],
        c=labels,
        s=50,
        cmap="viridis",
        edgecolors="k",  # 마커 테두리 색
        alpha=0.9,  # 투명도
        marker="o",  # 마커 모양 (o, ^, s, x 등)
    )
    plt.scatter(
        cent2d[:, 0],
        cent2d[:, 1],
        c="red",
        s=200,
        alpha=0.3,
        marker="o",
        label="centroids",
    )
    plt.title(f"User {user_id} Clusters")
    plt.xlabel("t-SNE 1")
    plt.ylabel("t-SNE 2")
    plt.legend()

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
