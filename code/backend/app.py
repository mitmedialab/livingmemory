import openai
import os
import pandas as pd
from flask import Flask, request
from flask_cors import CORS, cross_origin
import random

idk = ["I am not sure...", "I am so sorry, I don't know.", "I am afraid I do not know how to answer this question.", "I don't know. Even though I am an old man, my knowledge is limited. Can you ask me something else?", "I am sorry, I do not know the answer to that. I died over 500 years ago, so there are many things that I don't know. Can you ask me something else?"]

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

# Load your API key from an environment variable or secret management service
OPENAI_API_KEY = Exception("API KEY REDACTED")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
openai.api_key = OPENAI_API_KEY

# Read docs
f = open("leo-docs.txt", "r")
docs = f.readlines()
f.close()

## CLASS ##
from sentence_transformers import SentenceTransformer, util, models
import torch

class Character:

  def __init__(self, name, image_driver=None):
    
    self.s_prompt = ""
    self.name = name
    self.image_driver = image_driver
    self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
    self.corpus_embeddings = self.embedder.encode(docs, convert_to_tensor=True)


  def search_docs(self, query):
    # Find the closest 5 sentences of the corpus for each query sentence based on cosine similarity
    
    top_k = min(5, len(docs))
    query = query.replace("you", self.name)
    query_embedding = self.embedder.encode(query, convert_to_tensor=True)

    # We use cosine-similarity and torch.topk to find the highest 5 scores
    cos_scores = util.cos_sim(query_embedding, self.corpus_embeddings)[0]
    top_results = torch.topk(cos_scores, k=top_k)
    
    context = [docs[idx].replace(self.name+"'s", "my").replace(self.name, "I") for idx in top_results[1]]
    context_n = 2
    final_context = ""
    

    while len(final_context) < 2000 and len(context) >= context_n:
      context_n += 1
      final_context = ''.join(context[:context_n])

    final_context = final_context.replace(self.name+"'s", "my").replace(self.name, "I")
    final_context = [final_context, float(top_results[0][0].cpu().detach().numpy())]

    return final_context


  def style_transfer(self, context, question, qa_pairs):

    self.s_prompt = ""
    for q, a in qa_pairs:
      self.s_prompt += f'\n\nInterviewer:{q}\nAuthor:{a}'
    self.s_prompt += f'\n\nInterviewer:{question}\nAuthor:'
    self.f_prompt = f"Convert the following journal paragraph into a conversation between an interviewer and the author of the paragraph:\n\n\"{context}\"{self.s_prompt}"

    print("Calling GPT3")
    try :
        self.completion = openai.Completion.create(
                                              model = "text-davinci-002",
                                              prompt=self.f_prompt,
                                              temperature=0.3,
                                              max_tokens=80,
                                              top_p=.2,
                                              frequency_penalty=0,
                                              presence_penalty=0, 
                                              stop="\n",
                                              )["choices"][0]["text"]
    except:
        return random.choice(idk)

    self.completion = self.completion[:self.completion.rfind('.')]+'.'
    self.s_prompt += self.completion +'\n'

    return self.completion

  def generate_answer(self, question, qa_pairs=[]):
      
      import numpy as np 

      print("Searching docs")
      context = self.search_docs(question)
      answer = ""
      print("LLM")
      i = 0
      while len(answer) < 2:
        answer = self.style_transfer(context[0], question+" Please give me a long answer.", qa_pairs)
        i += 1
        if i >= 3:
            answer = random.choice(idk)
            break
      print(f"Q: {question}")
      print(f"A: {answer}\n")
      print(f"Answer Similarity to Question: {round(float(context[1]),2)}")

      # Calculate similarity between answer and doc
      embeddings1 = self.embedder.encode(context[0], convert_to_tensor=True)
      embeddings2 = self.embedder.encode(answer, convert_to_tensor=True)
      cosine_scores = util.cos_sim(embeddings1, embeddings2)
      print(f"Answer Similarity to Doc: {round(float(cosine_scores.detach().cpu().numpy()),2)}")
      print(f"-- Source --")
      print(context)

      if round(float(cosine_scores.detach().cpu().numpy()),2) < 0.3:
        answer = random.choice(idk)
        print(f"New A: {answer}\n")

      return answer


c = Character(name='Leonardo Da Vinci')


@app.route('/generate-answer', methods=['POST'])
@cross_origin()
def generate_answer():
    print("Got request")
    content = request.json

    result = "<h1>Result<h1>"

    if content["qa_pairs"] is not None:
      result += "<h2>Context</h2><ul>"
      for q, a in content["qa_pairs"]:
        result += f"<li>Interviewer: {q}<br/>Answer: {a}</li>"
      result += "</ul>"
    else:
      qa_pairs = []

    result += f"<h2>Question</h2><p>{content['question']}</p>"

    # return result
    print("Generating answer...")
    return c.generate_answer(content["question"], content["qa_pairs"])

if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0", use_reloader=False)

