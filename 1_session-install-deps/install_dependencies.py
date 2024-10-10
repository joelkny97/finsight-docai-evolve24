!pip install --upgrade pip
!pip install --no-cache-dir --log 1_session-install-deps/pip-req.log -r 1_session-install-deps/requirements.txt
!pip install -U --no-deps "feedparser>=6.0.8"
!npm install 1_session-install-deps/package.json --log 1_session-install-deps/npm-req.log