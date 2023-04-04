from loguru import logger
import json
from functools import lru_cache
from app import Character

@lru_cache
def get_character(character_name):
    return Character(character_name)

def endpoint(event, context):
    logger.info(event)
    logger.info(context)

    try:
        request = json.loads(event["body"])
        answer, context, score = get_character(request.get("character")).generate_answer(request.get("question"))
        response = { "answer": answer, "context": context }
        return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": True,
                },
                "body": json.dumps(response),
            }
    except Exception as e:
        logger.error(repr(e))
    
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True,
            },
            "body": json.dumps({ "error": repr(e), "event": event }),
        }

if __name__ == "__main__":
    print(endpoint({"body": json.dumps({"question": "Who are you?", "character": "Murasaki Shikibu"})}, None)["body"])
