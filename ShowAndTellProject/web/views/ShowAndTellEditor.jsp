<%@page import="DAO.CrudDao"%>
<%@page import="Model.Lecture"%>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="css/ShowAndTell.css" />
        <!-- jQuery and jQueryUI used for animations. -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
        <script src="js/html2canvas.js"></script>
        <script src="js/ShowAndTell.js"></script>
        <script src="js/side.js"></script>
        <script src="js/effects.js"></script>
    </head>
    <body>
        <!-- MOVED SIDEBAR -->
        <fieldset class="sideDiv">
            <legend> Lectures </legend>
            <div id="lectureSelection">
                <div class="dropdown" id="lecture" onchange="getLecture()">
                    <h3>Select a lecture</h3>
                    <%
                        Lecture[] lectures = new CrudDao().getLectures();
                        for (Lecture lecture : lectures) {
                    %>
                    <ul class="highlight" value="<%=lecture.getLectureID()%>"><%=lecture.getCourseTitle() + ": " + lecture.getLectureTitle()%></ul>
                    <%
                        }
                    %>
                </div>
                <button class="Add Image highlight" onclick="createLecture()"></button>
                <button class="Delete Image highlight"></button><br>    
            </div>
            <textarea class="lectureInput" rows="1" cols="10" id="courseTitle" placeholder="Course Title"></textarea>
            <textarea class="lectureInput" rows="1" cols="10" id="lectureTitle" placeholder="Lecture Title"></textarea>
            <textarea class="lectureInput" rows="1" cols="10" id="instructor" placeholder="Instructor"></textarea>
            <!-- Edit button
            <button id="editLecture" onclick="editLecture()">Edit Lecture</button> -->          
            <%
                if (lectures.length > 0) {
            %>
            <!-- <button id="deleteLecture" onclick="deleteLecture()">Delete Lecture</button><br> -->
<!--
            <label>Course:</label><br>
            <textarea cols="10" id="courseTitle"><%=lectures[0].getCourseTitle()%></textarea>
            <label>Lecture:</label><br>
            <textarea cols="10" id="lectureTitle"><%=lectures[0].getLectureTitle()%></textarea>
            <label>Instructor:</label>
            <textarea cols="10" id="instructor"><%=lectures[0].getInstructor()%></textarea>-->
            <%
                }
            %>
        </fieldset><br>
        <!-- END OF SIDEBAR -->
        <div id="middleDiv">
            <div id="outerPageDiv">
                <fieldset>
                    <legend>Pages</legend>
                    <div id="pageDiv">TEST</div>
                    <button class="Add Image highlight"></button>
                    <button class="Delete Image highlight"></button>
                </fieldset>
            </div>
            <div id="outerPreviewDiv">
                <fieldset>
                    <legend>Preview</legend>
                    <div id="previewDiv">TEST</div>
                </fieldset>
            </div>
            <div id="outerEntityDiv">
                <fieldset id="oEDivFieldSet1">
                    <legend>Entities</legend>
                    <div id="entityDiv">
                        <button class="highlight" id="newTextEntityButton" onclick="newTextEntity()">New Text Entity</button><br>
                        <button class="highlight" id="newListEntityButton" onclick="newListEntity()">New List Entity</button><br>
                        <button class="highlight" id="newImageEntityButton" onclick="newImageEntity()">New Image Entity</button>
                        <div id="entityPropertiesDiv">
                            <label>Z-Index</label>
                            <input type="number" min="0" value="0" onchange="updateZIndex()">
                            <br><br>
                            <label>Animation</label>
                            <div class="dropdown" id="animations" onchange="updateAnimation()">
                                <h3 value="None">None</h3>
                                <ul class="highlight" value="None">None</ul>
                                <ul class="highlight" value="Fade">Fade</ul>
                                <ul class="highlight" value="Slide">Slide</ul>
                                <ul class="highlight" value="Slide">Stretch</ul>
                                <ul class="highlight" value="Shrink">Shrink</ul>
                                <ul class="highlight" value="Grow">Grow</ul>
                            </div><br><br>
                            <label>Entity Content</label>
                            <div id="contentEditDiv"><textarea rows="5" cols="20" class="lectureInput" id="TESTID" placeholder="Enter text here. HTML can be used to style the display"></textarea></div>
                        </div>
                    </div>
                </fieldset>
        </div>
        <br><!--
        <fieldset>
            <legend>Entity Properties</legend>
            <div id="entityPropertiesDiv">
                <label>Z-Index</label>
                <input type="number" min="0" value="0" onchange="updateZIndex()">
                <label>Animation</label>
                <div class="dropdown" id="animations" onchange="updateAnimation()">
                    <h3 value="None">None</h3>
                    <ul class="highlight" value="None">None</ul>
                    <ul class="highlight" value="Fade">Fade</ul>
                    <ul class="highlight" value="Slide">Slide</ul>
                    <ul class="highlight" value="Slide">Stretch</ul>
                    <ul class="highlight" value="Shrink">Shrink</ul>
                    <ul class="highlight" value="Grow">Grow</ul>
                </div><br>
                <div id="contentEditDiv"><input type="textBox"></div>
            </div>
        </fieldset> --><br><br><br><br><br><br>
        <button class="highlight" onclick="pageSnapshot(new Slide())" >DO IT</button>
    </body>
</html>
