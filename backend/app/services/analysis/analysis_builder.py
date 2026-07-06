from typing import List
from app.schemas.response import AnalysisSchema
from app.services.analysis.rule_engine import ScoredAlgorithm
from app.services.analysis.template_engine import TemplateEngine


class AnalysisBuilder:
    @staticmethod
    def build(ranked: List[ScoredAlgorithm]) -> AnalysisSchema:
        """Assemble the final structured report from scored algorithms."""
        winner = ranked[0]
        runner_up = ranked[1] if len(ranked) > 1 else None

        return AnalysisSchema(
            bestAlgorithm=winner.algorithm,
            reason=TemplateEngine.generate_reason(winner, runner_up),
            strengths=TemplateEngine.generate_strengths(winner),
            weaknesses=TemplateEngine.generate_weaknesses(winner),
            executionSummary=TemplateEngine.generate_execution_summary(ranked),
            conclusion=TemplateEngine.generate_conclusion(winner, ranked),
        )
