<%-- 
    Document   : browseView
    Created on : Apr 1, 2016, 5:17:58 PM
    Author     : cir5274
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="Model.*" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="css/browse.css" rel="stylesheet">
        <!-- jQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
        <!-- Page Script -->
        <script src="js/browse.js"></script>
    </head>
    <body>
        <%Roster roster = (Roster)request.getAttribute("roster");%>
        <div id="teamsDiv">
            <fieldset>
                <select id="teamSelect">
                    <%
                        for (Team team : roster.getTeams()) {
                    %>
                    <option value="<%=team.getTeamID()%>"><%=team.getTeamID()%></option>
                    <%
                        }
                    %>
                </select>
                <legend>Teams</legend>
                <button onclick="deleteTeam()">Delete Team</button>
            </fieldset>
        </div>
        <table>
            <tr>
                <th onclick="sortTable(0)">LAST NAME</th>
                <th onclick="sortTable(1)">FIRST NAME</th>
                <th onclick="sortTable(2)">PSU ID</th>
                <th onclick="sortTable(3)">TEAM NUMBER</th>
            </tr>
            <!-- Generate table rows for each of the students in the roster. -->
            <%
                for (Student student : roster.getStudents()) {
            %>
            <tr class="view" id="<%=student.getID()%>" onclick="studentEdit(this.id)">
                <td><%=student.getLastName()%></td>
                <td><%=student.getFirstName()%></td>
                <td><%=student.getID()%></td>
                <td><%=student.getTeamNumber()%></td>
            </tr>
            <!-- Generate a hidden form for editing each student. -->
            <form method="POST" id="<%=student.getID()%>">
                <tr class="edit" hidden="true" id="<%=student.getID()%>">
                    <td><input type="text" name="lastName" value="<%=student.getLastName()%>"/></td>
                    <td><input type="text" name="firstName" value="<%=student.getFirstName()%>"/></td>
                    <td>
                        <%=student.getID()%>
                        <input type="hidden" name="id" value="<%=student.getID()%>"/>
                    </td>
                    <td>
                        <select name="team" value="<%=student.getID()%>">
                            <%
                                for (Team team : roster.getTeams()) {
                            %>
                            <option value="<%=team.getTeamID()%>"><%=team.getTeamID()%></option>
                            <%
                                }
                            %>
                        </select>
                    </td>
                    <td>
                        <input type="submit" />
                        <button id="<%=student.getID()%>" onclick="deleteStudent(this.id)">Delete</button>
                    </td>
                </tr>
            </form>
            <%
                }
            %>
            <form method="POST">
                <td><input type="text" name="lastName"></td>
                <td><input type="text" name="firstName"></td>
                <td><input type="text" name="id"></td>
                <td>
                    <select name="team">
                        <%
                            for (Team team : roster.getTeams()) {
                        %>
                        <option value="<%=team.getTeamID()%>"><%=team.getTeamID()%></option>
                        <%
                            }
                        %>
                    </select>
                </td>
                <td><input type="submit" value="Create Student"/></td>
            </form>
        </table>
    </body>
</html>
