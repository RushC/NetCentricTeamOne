<!DOCTYPE html>
<head>
    <title>CRUD operations using jTable</title>
    <!-- Include one of jTable styles. -->
    <link href="css/lightcolor/blue/jtable.css" rel="stylesheet" type="text/css" />
    <link href="css/jquery-ui.css" rel="stylesheet" type="text/css" />
    <script src="js/jquery-2.1.3.js" type="text/javascript"></script>
    <script src="js/jquery-ui.js" type="text/javascript"></script>
    <!-- Include jTable script file. -->
    <script src="js/jquery.jtable.js" type="text/javascript"></script>

    <script type="text/javascript">
        $(document).ready(function () {
            $('#StudentTableContainer').jtable({
                title: 'Students List',
                saveUserPreferences: false, //disable cookie saving
                paging: true, //Enable paging
                pageSize: 8, //Set page size (default: 10)
                sorting: true, //Enable sorting
                defaultSorting: 'psuId ASC', //Set default sorting
                actions: {
                    listAction: 'Controller?action=list',
                    createAction: 'Controller?action=create',
                    updateAction: 'Controller?action=update',
                    deleteAction: 'Controller?action=delete'
                },
                fields: {
                    psuId: {
                        title: 'PSU ID',
                        width: '20%',
                        key: true,
                        list: true,
                        edit: false,
                        create: true
                    },
                    firstName: {
                        title: 'First Name',
                        width: '30%',
                        edit: true
                    },
                    lastName: {
                        title: 'Last Name',
                        width: '30%',
                        edit: true
                    },
                    team: {
                        title: 'Team',
                        width: '20%',
                        edit: true,
                    }
                }
            });
            $('#StudentTableContainer').jtable('load');
        });
    </script>

</head>
<body>
    <div style="width: 80%; margin-right: 10%; margin-left: 10%; text-align: center;">

        <h4>AJAX based CRUD operations using jQuery.jTable</h4>
        <div id="StudentTableContainer"></div>
    </div>
</body>
</html>