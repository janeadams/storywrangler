FROM python:3
WORKDIR /usr/src/app
ADD . .
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["dash_test.py"]