import insightface
import numpy as np
import cv2


class FaceEngine:
    def __init__(self):
        self.model = insightface.app.FaceAnalysis(
            name="buffalo_l", providers=["CPUExecutionProvider"]
        )
        self.model.prepare(ctx_id=0)

    def get_faces(self, image: np.ndarray):
        if image is None:
            return []
        if image.shape[2] == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        return self.model.get(image)

    def get_embedding(self, face) -> np.ndarray:
        return face.embedding

    def cosine_similarity(self, a, b):
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# 전역 인스턴스
face_engine = FaceEngine()
