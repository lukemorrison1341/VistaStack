#!/bin/bash

echo "��� Uploading frontend to vista-ucf.com..."
scp -r ./dist/* bitnami@vista-ucf.com:~/htdocs/

if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
else
    echo "❌ Upload failed!"
fi
