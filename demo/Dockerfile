FROM public.ecr.aws/lambda/python:3.8

# Copy model directory into /var/task
ADD ./model ${LAMBDA_TASK_ROOT}/model/

ADD ./texts ${LAMBDA_TASK_ROOT}/texts/

ADD ./encodings ${LAMBDA_TASK_ROOT}/encodings/

# Copy `requirements.txt` into /var/task
COPY ./requirements.txt ${LAMBDA_TASK_ROOT}/

# install dependencies
RUN python3 -m pip install -r requirements.txt --target ${LAMBDA_TASK_ROOT}

# Copy function code into /var/task
COPY handler.py app.py bios.py ${LAMBDA_TASK_ROOT}/

# Set the CMD to our handler
CMD [ "handler.endpoint" ]