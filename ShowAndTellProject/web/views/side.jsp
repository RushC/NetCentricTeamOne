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
            <select>
                <%
                    System.out.println("Ayyyy lmao");
                    for (Lecture lecture : new CrudDao().getLectures()) {
                        System.out.println(lecture);
                %>
                <option value="<%=lecture.getLectureID()%>"><%=lecture.getLectureTitle()%></option>
                <%
                    }
                %>
                <!-- <option value="Something">Something</option> -->
            </select>

            <!--
            <button id="createSlide" onclick="createSlide()">Create Slide</button>
            <button id="editSlide" onclick="editSlide()">Edit Slide</button>
            <button id="deleteSlide" onclick="deleteSlide()">Delete Slide</button>
            -->

            <p class=sideMessage></p>
        </fieldset>
    </body>
</html>

