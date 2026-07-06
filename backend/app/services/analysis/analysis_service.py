from typing import List
from app.schemas.response import AnalysisSchema
from app.services.mask_metrics import AlgorithmMetrics
from app.services.analysis.rule_engine import RuleEngine
from app.services.analysis.analysis_builder import AnalysisBuilder


class AnalysisService:
    @staticmethod
    def analyze(all_metrics: List[AlgorithmMetrics]) -> AnalysisSchema:
        """Orchestrate: score algorithms via RuleEngine, then build report."""
        ranked = RuleEngine.evaluate(all_metrics)
        return AnalysisBuilder.build(ranked)
