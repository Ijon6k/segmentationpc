from typing import List
from dataclasses import dataclass, field
from app.services.mask_metrics import AlgorithmMetrics


@dataclass
class Observation:
    tag: str
    description: str
    score_delta: int


@dataclass
class ScoredAlgorithm:
    algorithm: str
    total_score: int
    observations: List[Observation] = field(default_factory=list)
    metrics: AlgorithmMetrics = None


class RuleEngine:
    @staticmethod
    def evaluate(all_metrics: List[AlgorithmMetrics]) -> List[ScoredAlgorithm]:
        """Score each algorithm based on observable findings. No hardcoded winner."""
        median_time = RuleEngine._median_time(all_metrics)

        scored = []
        for m in all_metrics:
            observations = []
            observations.extend(RuleEngine._evaluate_speed(m, median_time))
            observations.extend(RuleEngine._evaluate_noise(m))
            observations.extend(RuleEngine._evaluate_components(m))
            observations.extend(RuleEngine._evaluate_foreground(m))

            total = sum(o.score_delta for o in observations)
            scored.append(ScoredAlgorithm(
                algorithm=m.algorithm,
                total_score=total,
                observations=observations,
                metrics=m,
            ))

        scored.sort(key=lambda s: s.total_score, reverse=True)
        return scored

    @staticmethod
    def _median_time(all_metrics: List[AlgorithmMetrics]) -> float:
        times = sorted(m.execution_time_ms for m in all_metrics)
        n = len(times)
        if n == 0:
            return 1.0
        mid = n // 2
        if n % 2 == 0:
            return (times[mid - 1] + times[mid]) / 2.0
        return times[mid]

    @staticmethod
    def _evaluate_speed(m: AlgorithmMetrics, median_time: float) -> List[Observation]:
        obs = []
        if median_time > 0 and m.execution_time_ms < median_time * 0.5:
            obs.append(Observation(
                tag="fast_execution",
                description=f"Eksekusi sangat cepat ({m.execution_time_ms:.3f} ms).",
                score_delta=10,
            ))
        elif median_time > 0 and m.execution_time_ms > median_time * 2.0:
            obs.append(Observation(
                tag="slow_execution",
                description=f"Waktu komputasi relatif tinggi ({m.execution_time_ms:.3f} ms).",
                score_delta=-10,
            ))
        return obs

    @staticmethod
    def _evaluate_noise(m: AlgorithmMetrics) -> List[Observation]:
        obs = []
        if m.noise_ratio < 0.1:
            obs.append(Observation(
                tag="low_noise",
                description="Noise rendah — hasil segmentasi bersih.",
                score_delta=20,
            ))
        elif m.noise_ratio < 0.4:
            obs.append(Observation(
                tag="moderate_noise",
                description="Noise moderat terdeteksi pada hasil segmentasi.",
                score_delta=5,
            ))
        else:
            obs.append(Observation(
                tag="excessive_noise",
                description="Noise berlebih — banyak fragmen kecil terdeteksi.",
                score_delta=-20,
            ))
        return obs

    @staticmethod
    def _evaluate_components(m: AlgorithmMetrics) -> List[Observation]:
        obs = []
        if 1 <= m.connected_components <= 5:
            obs.append(Observation(
                tag="object_preserved",
                description="Objek utama terpreservasi dengan baik.",
                score_delta=20,
            ))
        elif m.connected_components > 50:
            obs.append(Observation(
                tag="over_segmentation",
                description=f"Potensi over-segmentation terdeteksi ({m.connected_components} komponen).",
                score_delta=-15,
            ))
        elif m.connected_components > 20:
            obs.append(Observation(
                tag="fragmented_object",
                description=f"Objek terfragmentasi menjadi {m.connected_components} bagian.",
                score_delta=-20,
            ))
        return obs

    @staticmethod
    def _evaluate_foreground(m: AlgorithmMetrics) -> List[Observation]:
        obs = []
        if m.foreground_ratio < 0.02 or m.foreground_ratio > 0.98:
            obs.append(Observation(
                tag="under_segmentation",
                description=(
                    "Potensi under-segmentation — "
                    f"foreground hanya {m.foreground_ratio * 100:.1f}% dari total piksel."
                ),
                score_delta=-15,
            ))
        elif 0.05 <= m.foreground_ratio <= 0.90:
            obs.append(Observation(
                tag="stable_segmentation",
                description=f"Segmentasi stabil dengan foreground ratio {m.foreground_ratio * 100:.1f}%.",
                score_delta=10,
            ))
        return obs
