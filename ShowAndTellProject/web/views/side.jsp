<%-- 
    Document   : side
    Created on : Apr 15, 2016, 9:06:00 PM
    Author     : njt5112
--%>

<%@page import="DAO.CrudDao"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="Model.*" %>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="css/side.css">
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,900,700' rel='stylesheet' type='text/css'>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
        <script src="js/side.js"></script>
    </head>
    <body>
        <fieldset class="sideDiv">
            <legend> Show & Tell </legend>
            <select id="lecture">
                <%
                    Lecture[] lectures = new CrudDao().getLectures();
                    for (Lecture lecture : lectures) {
                %>
                <option value="<%=lecture.getLectureID()%>"><%=lecture.getCourseTitle() + ": " + lecture.getLectureTitle()%></option>
                <%
                    }
                %>
            </select>

            <button id="editLecture" onclick="editLecture()">Edit Lecture</button>            
            <%
                if (lectures.length > 0) {
            %>
            <button id="deleteLecture" onclick="deleteLecture()">Delete Lecture</button><br>
            <label>Course:</label><br>
            <textarea cols="10" id="courseTitle"><%=lectures[0].getCourseTitle()%></textarea>
            <label>Lecture:</label><br>
            <textarea cols="10" id="lectureTitle"><%=lectures[0].getLectureTitle()%></textarea>
            <label>Instructor:</label>
            <textarea cols="10" id="instructor"><%=lectures[0].getInstructor()%></textarea>
            <%
                }
            %>
        </fieldset><br>
        <fieldset id="editField">
        </fieldset>
        <fieldset class="sideDiv">
            <button id="createLecture" onclick="createLecture()">Create Lecture</button>
        </fieldset><br>
    </body>
</html>
