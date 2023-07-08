"""Module collect link.html and convert into link.js"""
import json
import rtoml
from pathlib import Path

reverseShortDict = {}
jumpDict = {}
for link_path in Path("./link").glob("*.html"):
    if not link_path.is_dir():
        first_str = open(link_path).read().split("<!--break type:content format:html content-->")[0]
        header_str = first_str.split("<!--break type:header content-->")[-1]
        header_dict = rtoml.loads(header_str)
        key_str = header_dict["key"]
        reverseShortDict[key_str] = header_dict["table"]
        jump_dict = {n: header_dict[n] for n in ["en","hant","url"] if n in header_dict.keys()}
        jumpDict[key_str] = jump_dict

with open("static_files/link.js","w") as link_handle:
    reverseShortStr = json.dumps({n:reverseShortDict[n] for n in sorted(reverseShortDict)},indent=0)
    jumpStr = json.dumps({n:jumpDict[n] for n in sorted(jumpDict)},indent=0)
    content_str = F"var reverseShortDict = {reverseShortStr}\nvar jumpDict = {jumpStr}\n"
    link_handle.write(content_str)
