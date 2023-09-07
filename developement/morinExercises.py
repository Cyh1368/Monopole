import PyPDF2
import re

def extract_chapters_and_subchapters(pdf_path):
    pattern_exercises = r'^(\d+(\.\d+)*)\s+Exercises$'
    pattern_text = r'^(\d+(\.\d+)*)\.\s+(.*?)\n(.{1,200})'
    pattern_solutions = r'^(\d+(\.\d+)*)\s+Solutions$'
    exercise_dict = {}

    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)

        text = ''
        print(len(pdf_reader.pages))
        # for page_num in range(len(pdf_reader.pages)):
        for page_num in range(6, 100):
            text += pdf_reader.pages[page_num].extract_text()

        for match in re.finditer(pattern_text, text, flags=re.MULTILINE):
            section_label = match.group(1)
            first_text = match.group(3).strip()
            second_text = match.group(4).strip()

            exercise_dict[section_label] = {
                'First Text': first_text,
                'Second Text': second_text
        }
        # Split the text by the pattern for "Exercises"
        # exercises_sections = re.split(pattern_exercises, text, flags=re.MULTILINE)

        # exercises_text = exercises_sections[3]

        # Iterate through the sections after "Exercises"
        # print(len(exercises_sections))
        # print(exercises_sections[3])

        # for match in re.finditer(pattern_text, exercises_text, re.MULTILINE):
        #     label = match.group(1)
        #     title = match.group(3)
        #     statement = match.group(4)
        #     exercise_dict[label] = {
        #         "ExerciseTitle":title,
        #         "ExerciseStatement":statement
        #     }
            

    return exercise_dict

if __name__ == "__main__":
    pdf_file_path = "morin.pdf"
    chapters = extract_chapters_and_subchapters(pdf_file_path)

    for chapter_label, chapter_name in chapters.items():
        print(f"{chapter_label}: {chapter_name}")
