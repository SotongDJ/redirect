"""Module collect link.html and convert into link.js"""
import json
from pathlib import Path
import rtoml

# pylint: disable=C0103
config_dict = {}
with open("./config.toml",encoding="utf-8") as config_handle:
    config_dict.update(rtoml.load(config_handle))
base_url = config_dict["base_url"]

reverseShortDict = {}
jumpDict = {}
redirection_dict = {}
split_str = "<!--break type:content format:html content-->"
jump_header = ["en","hant","url"]
for link_path in Path("./link").glob("*.html"):
    if not link_path.is_dir():
        with open(link_path,encoding="utf-8") as link_handle:
            first_str = link_handle.read().split(split_str)[0]
            header_str = first_str.split("<!--break type:header content-->")[-1]
            header_dict = rtoml.loads(header_str)
            url_test = header_dict.get("url","")
            if "key" in header_dict.keys() and len(url_test) > 0:
                key_str = header_dict["key"]
                reverseShortDict[key_str] = header_dict["table"]
                jump_dict = {n: header_dict[n] for n in jump_header if n in header_dict.keys()}
                jumpDict[key_str] = jump_dict
                redirection_dict[key_str] = {
                    "title": jump_dict.get("en",jump_dict.get("hant","- no title -")),
                    "link": f"{base_url}/?{key_str}",
                    "target": url_test,
                }

with open("static_files/link.js","w", encoding="utf-8") as link_handle:
    reverseShortStr = json.dumps({n:reverseShortDict[n] for n in sorted(reverseShortDict)},indent=0)
    jumpStr = json.dumps({n:jumpDict[n] for n in sorted(jumpDict)},indent=0)
    content_str = F"var reverseShortDict = {reverseShortStr}\nvar jumpDict = {jumpStr}\n"
    link_handle.write(content_str)

original_content = []
with open("./README.md",encoding="utf-8") as readme_handle:
    original_content.extend(readme_handle.read().split("## "))

new_content = []
for content in original_content:
    if content[:11] == "Redirection":
        alt_content = "Redirection\n\nTitle | Link | Target\n------|------|-------\n"
        for key_str,value_dict in redirection_dict.items():
            sub_title_str = value_dict["title"]
            sub_link_str = value_dict["link"]
            sub_target_str = value_dict["target"]
            alt_content += f"{sub_title_str} | <{sub_link_str}> | <{sub_target_str}>\n"
        alt_content += "\n"
        new_content.append(alt_content)
    else:
        new_content.append(content)

with open("./README.md","w",encoding="utf-8") as readme_handle:
    readme_handle.write("## ".join(new_content))
