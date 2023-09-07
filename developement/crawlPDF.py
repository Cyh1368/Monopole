import PyPDF2
import re

def extract_chapters_and_subchapters(pdf_path):
    chapter_pattern = r'^(\d+(\.\d+)*)\s+(.*?)\s+(\d+)$'
    chapter_dict = {}

    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)

        text = ''
        print(len(pdf_reader.pages))
        # for page_num in range(len(pdf_reader.pages)):
        for page_num in range(6, 12):
            text += pdf_reader.pages[page_num].extract_text()

        preface_start = text.find('Contents')
        preface_text = text[preface_start:]

        for match in re.finditer(chapter_pattern, preface_text, re.MULTILINE):
            chapter_label = match.group(1)
            chapter_name_text = match.group(3)
            page_number = str(match.group(4)) if match.group(4) else None

            chapter_info = {
                'Chapter Name': chapter_name_text.strip(),
                'Page Number': page_number
            }

            chapter_dict[chapter_label] = chapter_info

    return chapter_dict

if __name__ == "__main__":
    pdf_file_path = "morin.pdf"
    chapters = extract_chapters_and_subchapters(pdf_file_path)

    for chapter_label, chapter_name in chapters.items():
        print(f"{chapter_label}: {chapter_name}")
