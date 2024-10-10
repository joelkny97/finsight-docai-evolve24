# financeqa/views.py

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny
from finance.docai.finance_qa import FinanceQAProcessor

class FinanceQAView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser]

    def __init__(self):
        super().__init__()
        self.processor = FinanceQAProcessor()

    def post(self, request, *args, **kwargs):
        # Get the PDF file and question from the request
        pdf_file = request.FILES.get('file')
        question = request.data.get('question')

        if not pdf_file or not question:
            return JsonResponse({'error': 'No PDF file or question provided.'}, status=400)

        try:
            answer = self.processor.process_pdf_and_generate_answer(pdf_file, question)
            return JsonResponse(answer, safe=False)
        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)
