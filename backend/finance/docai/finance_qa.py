# financeqa/utils.py

import torch
from transformers import AutoModelForCausalLM, AutoProcessor, AutoConfig
from pdf2image import convert_from_path
import os
import tempfile
from PIL import Image

class FinanceQAProcessor:
    def __init__(self):
        # Load and configure the model
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.config = AutoConfig.from_pretrained("microsoft/Florence-2-base-ft", trust_remote_code=True)
        self.config.vision_config.model_type = "davit"
        self.model = AutoModelForCausalLM.from_pretrained("sujet-ai/Lutece-Vision-Base", config=self.config, trust_remote_code=True).to(self.device).eval()
        self.processor = AutoProcessor.from_pretrained("sujet-ai/Lutece-Vision-Base", config=self.config, trust_remote_code=True)
        self.task = "<FinanceQA>"

    def process_pdf_and_generate_answer(self, pdf_file, question):
        # Convert PDF to image
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
            for chunk in pdf_file.chunks():
                temp_pdf.write(chunk)
            temp_pdf_path = temp_pdf.name

        images = convert_from_path(temp_pdf_path)

        # Assuming we only take the first page for simplicity
        if images:
            image = images[0].convert('RGB')
        else:
            os.remove(temp_pdf_path)
            raise ValueError('No images could be extracted from the PDF.')

        # Process input and generate answer
        inputs = self.processor(text=question, images=image, return_tensors="pt").to(self.device)
        generated_ids = self.model.generate(
            input_ids=inputs["input_ids"],
            pixel_values=inputs["pixel_values"],
            max_new_tokens=1024,
            do_sample=False,
            num_beams=3,
        )

        # Decode and parse the answer
        generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
        parsed_answer = self.processor.post_process_generation(generated_text, task=self.task, image_size=(image.width, image.height))

        # Clean up temporary files
        os.remove(temp_pdf_path)

        return parsed_answer[self.task]
