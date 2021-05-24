# -*- coding:utf-8 -*-
import os
import sys

def visit_dir(dir):
    for file_name in os.listdir(dir):
        abs_name = os.path.join(dir, file_name)
        if os.path.isdir(abs_name):
            visit_dir(abs_name)
        elif abs_name.find(".meta") != -1:
            os.remove(abs_name)

if __name__ == '__main__':
    visit_dir(os.getcwd())
