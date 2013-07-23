# -*- coding: utf-8 -*-

import os
from flask import Flask
from flask import render_template

app = Flask(__name__,
    static_folder = os.path.join('project', 'static'),
    template_folder = os.path.join('project','templates')
)
#app.config.from_object('conf.development')

@app.route('/')
def hello():
    return render_template('base.html')

if __name__ == '__main__':
    app.run(debug=True)
