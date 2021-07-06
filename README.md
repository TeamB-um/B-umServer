# 비움 B-um
살아가며 필연적으로 마주치는 크고 작은 스트레스들...</br>
완벽한 해결이 아니더라도 한 스푼 덜어드리겠습니다. 
당신을 괴롭히는 스트레스, 휴지통에 버려버리세요! 
 
![ex_screenshot](./readimg/first_page.png)

<h3> 1. R&R </h3>
<div id="about_team">

|  <center>Name</center> |  <center>Major</center> |  <center>Role</center> |
|:--------|:--------:|--------:|
|**bob.siunn** | <center>BA & CS </center> |Data selection and engineering |
|**Yongwook Lee** | <center>CS </center> |UIUX design and front end developer |
|**Lee Jeong Min** | <center>BA & CS </center> |Server deployment and link |
|**skyriver228** | <center>Biomedical Convergence Engineering </center> | ML Modeling |
|**Sarah Son** | <center>BA </center> | Data collecting and documentation |

<h3> 2. Introduction </h3>
<div id="about_Introduction">

Learn ON is a AI-based online re-edcation assistent which can overcome online learner's pain point on E-learning process and maximaize the advantages of online learning. As a result, we provide a new paradigm for E-learning.  
  
![ex_screenshot](./readimg/LearnON_Introduction.PNG)  
  
* Vision  
: Learn ON aims to improve the inconvenience and inefficiency of online learning in the face of inevitable online learning with Corona 19, and maximize the advantages and convenience of online learning alone, unlike offline learning.  

* Background  
    * Since Covid 19, most offline lectures have moved to online platforms due to social distancing.
    * As a result, the online learning market has experienced unprecedented growth, and this trend is expected to continue even after the end of the Korona 19 crisis.
    * The reason why online learning is so welcomed by learners is that learners can listen to lectures at any time, watch videos again, and re-learn at any time they want.
    * However, there are some unresolved pain points in current online learning.
    * When they have questions while they are in the process of learning, they have to wait a lot of time to get answers, and they do not know at what point they want to check again during the re-learning, which takes inefficient exploration time.  
  
* Why AI?
    * By introducing ai to analyze lecture videos, you can check the overall course flow without having to check the contents of each person.
    * By introducing NLP and STT models in open source or api form to handle online lecture videos that are subject to the service, we can efficiently deliver the desired utility to users.
    * Online lecture video data is expected to perform well in NLP as the flow of lectures is consistent and specific terms act as an index of the flow of lectures and simultaneously separate contexts.
    * In addition, due to the nature of data for information delivery, the quality of STT results is good because of the accurate pronunciation.
  
* Service Feature
    * Auto Bookmark Generator  
    : Automatic bookmark generation function that analyzes the course content and generates bookmarks for key keywords
    * Q&A AI Chatbot  
    : The ability to text the content of a class when you click on the key keyword that makes up the course content.

* Expected Effect
    * Learners can re-learn more effectively through Learn ON.  
    * At any time, you can selectively find and relearn only the necessary parts of the long lecture video, and you can search for the timeline of the parts you need through keyword input.  
    * By storing the desired parts, the efficiency of relearning them several times can be greatly expected.  
    * Because AI assistant can be learned through questions without burden, it can greatly complements the lack of interactions between professors and learners online. 


<h3> 3. Usage </h3>
<div id="about_Usage">

#### Server Link
: http://13.125.220.170:3000/  

#### Follow this step
1. Type ID & Password (there is login page but It's okay to pass because we didn't implement the membership function.)  
2. Click Financial Management subject on the Dashboard page (The actual lecture video name is "Differential calculus 1.")  
3. You can play lecture video on left page  
4. You can find bookmarks of main keyword on the right
5. If you click the keyword, you can see text of that keyword in lecture video

#### Warnings
1. This server is accessible only when the terminal is open. If the server is closed and the execution is not normal, please contact to us on Slack.
2. There is a limit on the length and capacity of the video uploaded on the lecture video upload screen due to the limitations of the API. 
3. Please avoid trying to upload mp4 file on video upload page and move straight to the video play page.
4. Nevertheless, if you want to try the video upload function, please try the "example1.mp4" video file in the Google Drive folder we provided.

<h3> 4. How we built it </h3>
<div id="about_How we built it">
 
#### Languages and Frameworks  
|  <center>Language and Frameworks</center> |  <center>Version</center> |
|:--------|:--------:|
|**Python** | <center>3.7.4</center> |
|**Jupyter Notebook** | <center> - </center> |
|**Express** | <center>4.17.1</center> |
|**React** | <center>17.0.1</center> |
|**React Player** | <center>2.9.0</center> |
|**React Dropzone** | <center>11.3.1</center> |
|**Node.js** | <center>15.9.1</center> |
|**NPM** | <center>7.5.3</center> |

#### Used AWS API
* Amazone S3
* Amazone Transcribe
* Amazone Comprehend

#### About Structure  
* Entire Structure  
: Go to wiki/about entire structure  
* ML Structure  
: Go to wiki/about ML structure  
