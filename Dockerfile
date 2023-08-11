#FROM baseimage (enviroment to excute) 
FROM node 


#COPY all the current file which is Monopole in this case to . /test_docker 
#(create a new image file #in docker file system called "test_docker") 
COPY . /test-docker2 


# install the necessary dependencies
RUN npm install

# excute what command if using this docker image 
CMD node ./test-docker2/server.js 


# the command to create an docker image 
#<docker build -t <name> <location of docker image(use . if in the current dir)>




