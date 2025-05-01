import matplotlib

matplotlib.use("Agg")

import io
import numpy as np

import matplotlib.pyplot as plt
from fastapi.responses import StreamingResponse
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
from typing import Dict, Any

from src.services.user.clustering_state import face_db


def update_user_clusters(
    face_db: Dict[int, Dict[str, Any]],
    user_id: int,
    threshold: int = 5,  # 클러스터링에 필요한 최소 데이터 수(임계치)
    n_clusters: int = 6,  # 클러스터의 개수(k)
):
    # 사용자 원본 벡터 리스트(raw 데이터) 가져오기
    user_data = face_db.get(user_id)

    if not user_data or "raw" not in user_data:
        return f"사용자 {user_id}의 raw 데이터가 없습니다."

    raw = user_data["raw"]
    if len(raw) < threshold:
        return f"사용자 {user_id}의 raw 벡터 수가 {threshold}개 미만이므로 클러스터링 중단."

    # 사용자 등록 데이터가 임계치(5개 이상)을 넘어가면 클러스터링 수행
    X = np.array(raw)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(X)

    face_db[user_id]["clusters"] = {
        "centroids": kmeans.cluster_centers_.tolist(),  # 각 클러스터의 중심 벡터
        "labels": kmeans.labels_.tolist(),  # 각 벡터가 어떤 클러스터에 속하는지 (0, 1, 2 등)
    }
    return f"사용자 {user_id} 클러스터링 완료: {n_clusters}개 클러스터 생성."


# 클러스터링 시각화
def visualize_clusters(face_db: Dict[int, Dict[str, Any]], user_id: int):
    user_data = face_db.get(user_id)
    if not user_data or "clusters" not in user_data or "raw" not in user_data:
        return "시각화할 클러스터링 데이터가 없습니다."

    raw = np.array(user_data["raw"])
    labels = np.array(user_data["clusters"]["labels"])
    centroids = np.array(user_data["clusters"]["centroids"])

    combined = np.vstack([raw, centroids])
    perp = max(2, min(30, (len(combined) - 1) // 3))
    tsne = TSNE(n_components=2, random_state=42, perplexity=perp)
    emb2d = tsne.fit_transform(combined)

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
