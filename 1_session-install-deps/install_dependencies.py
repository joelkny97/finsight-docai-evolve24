!python -m venv venv
!source venv/bin/activate
!pip install --upgrade pip
!pip install --no-cache-dir --log 1_session-install-deps/pip-req.log -U --no-deps "feedparser>=6.0.8" -r 1_session-install-deps/requirements.txt
!cd ../frontend && npm install --log 1_session-install-deps/npm-req.log

