# The Repository for the Paper Living Memory: AI-Generated Characters as Digital Mementos

 Published in ACM IUI 2023

## Abstract

Every human culture has developed practices and rituals associated with remembering people of the past - be it for mourning, cultural preservation, or learning about historical events. In this paper, we present the concept of "Living Memories": interactive digital mementos that are created from journals, letters and data that an individual have left behind. Like an interactive photograph, living memories can be talked to and asked questions, making accessing the knowledge, attitudes and past experiences of a person easily accessible. To demonstrate our concept, we created an AI-based system for generating living memories from any data source and implemented living memories of the three historical figures "Leonardo Da Vinci", "Murasaki Shikibu", and "Captain Robert Scott". As a second key contribution, we present a novel metrics scheme for evaluating the accuracy of living memory architectures and show the accuracy of our pipeline to improve over baselines. Finally, we compare the user experience and learning effects of interacting with the living memory of Leonardo Da Vinci to reading his journal. Our results show that interacting with the living memory, in addition to simply reading a journal, increases learning effectiveness and motivation to learn about the character.


## Backend System

This code is a Flask web application that uses OpenAI's GPT-3 and Sentence Transformers to generate answers in the style of Leonardo Da Vinci. The application takes a user's question and returns a response as if Leonardo Da Vinci was answering it.

### Dependencies

- openai
- os
- pandas
- flask
- flask_cors
- random
- sentence_transformers
- torch

### Installation

To set up the environment, install the required packages using `pip`:


pip install openai pandas flask flask_cors sentence_transformers torch


### Usage

1. Set the `OPENAI_API_KEY` variable to your OpenAI API key.
2. Run the application using `python <filename>.py`. This will start the Flask server on port 8080 and make it accessible from any IP address.
3. Send a POST request to the `/generate-answer` endpoint with the following JSON payload:

json
{
  "question": "Your question here",
  "qa_pairs": [
    ["Previous question 1", "Previous answer 1"],
    ["Previous question 2", "Previous answer 2"]
  ]
}


The `qa_pairs` field is optional and can be used to provide additional context for the generated answer.

4. The server will return a response containing the generated answer in the style of Leonardo Da Vinci.

### Key Components

- `Character` class: This class represents the character (Leonardo Da Vinci) and is responsible for generating answers.
  - `search_docs()`: Searches the provided documents for context related to the question.
  - `style_transfer()`: Transforms the context into a conversation between an interviewer and the author (Da Vinci) using GPT-3.
  - `generate_answer()`: Generates an answer to the question using the context and style transfer.

- Flask server: The server listens for POST requests to the `/generate-answer` endpoint and returns the generated answer.

### Limitations

- The quality of the generated answer depends on the quality of the provided documents and the relevance of the question to the character's knowledge.
- The code uses a fixed GPT-3 model and configuration, which may not be optimal for all questions and contexts.
- The server currently has no authentication or rate limiting, making it vulnerable to abuse if exposed to the public internet.
