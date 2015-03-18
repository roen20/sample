<!doctype html>
<html class="">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title></title>
        <link rel="shortcut icon" href="images/favicon.ico"/>
        <link href="<?php echo base_url(); ?>assets/frontend/css/bootstrap.min.css" rel="stylesheet" type="text/css">
        <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
        <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
        <script src="<?php echo base_url(); ?>assets/frontend/js/bootstrap.min.js"></script>
        <script src="<?php echo base_url(); ?>assets/frontend/js/npm.js"></script>
        <script>
            $(function () {
                $('.hotels').click(function () {
                    $num = $(this).attr('rel');
                });
            });
        </script>
    </head>
    <body>
        <div class="container-fluid">
            <nav class="navbar navbar-default navbar-static-top" role="navigation">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">Hotel</a>
                </div>
                <div>
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">How It Works</a></li>
                        <li><a href="#">Locations</a></li>
                        <li><a href="<?php echo base_url(); ?>frontend/logout">Logout</a></li>
                    </ul>
                </div>
            </nav>

