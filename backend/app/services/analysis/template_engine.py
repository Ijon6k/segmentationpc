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

# Observation tag → trait phrase for composing the reason sentence
_TRAIT_PHRASES = {
    "fast_execution": "waktu komputasi yang cepat",
    "low_noise": "tingkat noise yang rendah",
    "moderate_noise": "tingkat noise yang moderat",
    "object_preserved": "preservasi objek utama yang baik",
    "stable_segmentation": "segmentasi yang stabil",
}

_WEAKNESS_PHRASES = {
    "slow_execution": "waktu komputasi yang lebih tinggi dibanding beberapa algoritma lainnya",
    "excessive_noise": "tingkat noise yang tinggi pada hasil segmentasi",
    "fragmented_object": "fragmentasi objek menjadi beberapa bagian",
    "over_segmentation": "potensi over-segmentation",
    "under_segmentation": "potensi under-segmentation",
}


class TemplateEngine:
    @staticmethod
    def generate_reason(winner: ScoredAlgorithm, runner_up: ScoredAlgorithm) -> str:
        """Generate an image-specific explanation without exposing internal scores."""
        positive_traits = []
        negative_traits = []

        for obs in winner.observations:
            if obs.score_delta > 0 and obs.tag in _TRAIT_PHRASES:
                positive_traits.append(_TRAIT_PHRASES[obs.tag])
            elif obs.score_delta < 0 and obs.tag in _WEAKNESS_PHRASES:
                negative_traits.append(_WEAKNESS_PHRASES[obs.tag])

        # Build the main sentence
        if positive_traits:
            traits_text = TemplateEngine._join_list(positive_traits)
            reason = (
                f"Pada citra yang diuji, metode {winner.algorithm} direkomendasikan "
                f"karena menghasilkan {traits_text}"
            )
        else:
            reason = (
                f"Pada citra yang diuji, metode {winner.algorithm} direkomendasikan "
                f"sebagai opsi terbaik di antara algoritma yang dievaluasi"
            )

        # Add caveat if there are negative traits
        if negative_traits:
            caveat_text = TemplateEngine._join_list(negative_traits)
            reason += f", meskipun memiliki {caveat_text}"

        reason += "."

        # Add runner-up comparison
        if runner_up and runner_up.algorithm != winner.algorithm:
            runner_positives = [
                o for o in runner_up.observations if o.score_delta > 0
            ]
            if runner_positives:
                best_runner_obs = max(runner_positives, key=lambda o: o.score_delta)
                runner_trait = _TRAIT_PHRASES.get(best_runner_obs.tag, "")
                if runner_trait:
                    reason += (
                        f" {runner_up.algorithm} juga menunjukkan hasil kompetitif "
                        f"dengan {runner_trait}."
                    )

        return reason

    @staticmethod
    def generate_strengths(winner: ScoredAlgorithm) -> List[str]:
        """Collect positive findings + algorithm characteristic."""
        strengths = []

        for obs in winner.observations:
            if obs.score_delta > 0:
                strengths.append(obs.description)

        algo_strength = ALGO_STRENGTHS.get(winner.algorithm)
        if algo_strength:
            strengths.append(algo_strength)

        return strengths if strengths else ["Tidak ada kelebihan signifikan yang terdeteksi pada citra ini."]

    @staticmethod
    def generate_weaknesses(winner: ScoredAlgorithm) -> List[str]:
        """Collect negative findings + algorithm characteristic."""
        weaknesses = []

        for obs in winner.observations:
            if obs.score_delta < 0:
                weaknesses.append(obs.description)

        algo_weakness = ALGO_WEAKNESSES.get(winner.algorithm)
        if algo_weakness:
            weaknesses.append(algo_weakness)

        return weaknesses if weaknesses else ["Tidak ada kelemahan signifikan yang terdeteksi pada citra ini."]

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
        """Final image-specific wrap-up without exposing scores."""
        total_algos = len(ranked)
        neg_count = sum(1 for o in winner.observations if o.score_delta < 0)

        if neg_count == 0:
            return (
                f"Dari {total_algos} algoritma yang diuji pada citra ini, {winner.algorithm} "
                "menunjukkan kombinasi kualitas segmentasi dan performa terbaik "
                "tanpa temuan negatif yang signifikan."
            )

        return (
            f"Dari {total_algos} algoritma yang diuji pada citra ini, {winner.algorithm} "
            "memberikan keseimbangan terbaik antara kualitas hasil dan kecepatan pemrosesan, "
            f"dengan {neg_count} catatan yang perlu dipertimbangkan."
        )

    @staticmethod
    def _join_list(items: List[str]) -> str:
        """Join list items with commas and 'dan' for the last item."""
        if len(items) == 1:
            return items[0]
        return ", ".join(items[:-1]) + " dan " + items[-1]
