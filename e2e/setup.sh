#!/bin/sh

TEST_FOLDER="`pwd`/e2e-temp"

rm -rf $TEST_FOLDER
echo "SETUP: removed test folder, $TEST_FOLDER"

mkdir $TEST_FOLDER
echo "SETUP: created test folder, $TEST_FOLDER"

printf "First Note\nThis is the preview text\nThis is another line" > "$TEST_FOLDER/note-0.md"
echo "SETUP: added sample note in test folder, $TEST_FOLDER/note-0.md"
