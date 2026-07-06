from typing import List
from app.services.analysis.rule_engine import ScoredAlgorithm

# Algorithm-specific characteristic sentences (strengths/weaknesses)
ALGO_STRENGTHS = {
    "Threshold": "Cocok untuk citra dengan kontras tinggi dan pemrosesan sangat cepat.",
    "Adaptive Threshold": "Mampu menangani pencahayaan tidak merata lebih baik dari Global Thresholding.",
    "Otsu": "Menentukan threshold optimal secara otomatis tanpa parameter manual.",
    "Region Growing": "Efektif untuk mengelompokkan wilayah dengan intensitas homogen.",
    "Watershed": "Unggul dalam memisahkan objek yang saling berdekatan atau bersentuhan.",
    "K-Means": "Mampu mengelompokkan piksel berdasarkan kemiripan warna pada citra multi-warna.",
}

ALGO_WEAKNESSES = {
    "Threshold": "Sensitif terhadap pencahayaan tidak merata dan rentan terhadap noise.",
    "Adaptive Threshold": "Hasil dapat mengandung lebih banyak noise dibanding metode global.",
    "Otsu": "Performa menurun pada citra yang histogramnya tidak bimodal.",
    "Region Growing": "Sangat bergantung pada kualitas seed pixel dan toleransi intensitas.",
    "Watershed": "Dapat menghasilkan over-segmentation pada citra dengan noise tinggi.",
    "K-Means": "Waktu komputasi lebih tinggi dan hasil bergantung pada parameter K.",
}


class TemplateEngine:
    @staticmethod
    def generate_reason(winner: ScoredAlgorithm, runner_up: ScoredAlgorithm) -> str:
        """Generate a 2-3 sentence reason from observations."""
        parts = []

        # Lead sentence
        parts.append(
            f"{winner.algorithm} direkomendasikan berdasarkan evaluasi multifaktor "
            f"dengan skor {winner.total_score} poin."
        )

        # Highlight top positive observation
        positives = [o for o in winner.observations if o.score_delta > 0]
        if positives:
            best_obs = max(positives, key=lambda o: o.score_delta)
            parts.append(best_obs.description)

        # Comparison with runner-up
        if runner_up and runner_up.algorithm != winner.algorithm:
            diff = winner.total_score - runner_up.total_score
            if diff <= 5:
                parts.append(
                    f"Selisih skor sangat tipis dengan {runner_up.algorithm} "
                    f"({runner_up.total_score} poin) — keduanya memberikan hasil kompetitif."
                )
            else:
                parts.append(
                    f"Dibandingkan {runner_up.algorithm} ({runner_up.total_score} poin), "
                    f"algoritma ini unggul {diff} poin."
                )

        return " ".join(parts)

    @staticmethod
    def generate_strengths(winner: ScoredAlgorithm) -> List[str]:
        """Collect positive findings + algorithm characteristic."""
        strengths = []

        # Observation-based strengths
        for obs in winner.observations:
            if obs.score_delta > 0:
                strengths.append(obs.description)

        # Algorithm-specific strength
        algo_strength = ALGO_STRENGTHS.get(winner.algorithm)
        if algo_strength:
            strengths.append(algo_strength)

        return strengths if strengths else ["Tidak ada kelebihan signifikan yang terdeteksi."]

    @staticmethod
    def generate_weaknesses(winner: ScoredAlgorithm) -> List[str]:
        """Collect negative findings + algorithm characteristic."""
        weaknesses = []

        # Observation-based weaknesses
        for obs in winner.observations:
            if obs.score_delta < 0:
                weaknesses.append(obs.description)

        # Algorithm-specific weakness
        algo_weakness = ALGO_WEAKNESSES.get(winner.algorithm)
        if algo_weakness:
            weaknesses.append(algo_weakness)

        return weaknesses if weaknesses else ["Tidak ada kelemahan signifikan yang terdeteksi."]

    @staticmethod
    def generate_execution_summary(ranked: List[ScoredAlgorithm]) -> str:
        """Format a speed comparison of all algorithms."""
        lines = []
        sorted_by_time = sorted(ranked, key=lambda s: s.metrics.execution_time_ms)
        for i, s in enumerate(sorted_by_time, start=1):
            lines.append(f"{i}. {s.algorithm}: {s.metrics.execution_time_ms:.3f} ms")
        return " | ".join(lines)

    @staticmethod
    def generate_conclusion(winner: ScoredAlgorithm, ranked: List[ScoredAlgorithm]) -> str:
        """Final one-sentence wrap-up based on observations."""
        neg_count = sum(1 for o in winner.observations if o.score_delta < 0)
        total_algos = len(ranked)

        if neg_count == 0:
            return (
                f"Dari {total_algos} algoritma yang diuji, {winner.algorithm} "
                "menunjukkan performa terbaik tanpa temuan negatif."
            )

        return (
            f"Dari {total_algos} algoritma yang diuji, {winner.algorithm} "
            f"memperoleh skor tertinggi meskipun memiliki {neg_count} catatan observasi."
        )
