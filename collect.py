#!/bin/env python3
"""Module collect link.html and convert into link.js"""
from pathlib import Path
import json
import urllib.parse
import idna
import rtoml
from datetime import datetime, timedelta, timezone

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
query_header = ["en","hant","query"]
for link_path in Path("./link").glob("*.html"):
    if not link_path.is_dir():
        with open(link_path,encoding="utf-8") as link_handle:
            print(f"Processing: {link_path}")
            first_str = link_handle.read().split(split_str)[0]
            header_str = first_str.split("<!--break type:header content-->")[-1]
            header_dict = rtoml.loads(header_str)
            url_test = header_dict.get("url","")
            query_test = header_dict.get("query","")
            if "key" in header_dict.keys() and len(url_test) > 0:
                key_str = header_dict["key"]
                jump_dict = {n: header_dict[n] for n in jump_header if n in header_dict.keys()}
                reverseShortDict[key_str] = header_dict["table"]
                jumpDict[key_str] = jump_dict
                redirection_dict[key_str] = {
                    "title": jump_dict.get("en",jump_dict.get("hant","- no title -")),
                    "link": f"{base_url}/?{key_str}",
                    "target": url_test,
                }
                if len(query_test) > 0:
                    query_str = header_dict["key"]+"_QUERY"
                    query_dict = {n: header_dict[n] for n in query_header if n in header_dict.keys()}
                    reverseShortDict[query_str] = {"en":[query_str]}
                    jumpDict[query_str] = query_dict

with open("static_files/link.js","w", encoding="utf-8") as link_handle:
    reverseShortStr = json.dumps({n:reverseShortDict[n] for n in sorted(reverseShortDict)},indent=0)
    jumpStr = json.dumps({n:jumpDict[n] for n in sorted(jumpDict)},indent=0)
    content_str = F"var reverseShortDict = {reverseShortStr}\nvar jumpDict = {jumpStr}\n"
    link_handle.write(content_str)

original_content = []
with open("./README.md",encoding="utf-8") as readme_handle:
    original_content.extend(readme_handle.read().split("## "))

def desc(input_str):
    """Convert input_str into utf-8"""
    if input_str[:3] == "xn-":
        try:
            output_str = idna.decode(input_str).encode().decode('utf-8')
        except idna.IDNAError:
            output_str = input_str
    else:
        output_str = urllib.parse.unquote(input_str)
    return output_str

new_content = []
new_table = ["<table>"]
new_table.append("<tr>")
new_table.append("<th>Title</th>")
new_table.append("<th>Link</th>")
new_table.append("<th>Target</th>")
new_table.append("<th>Keywords</th>")
new_table.append("</tr>")
for content in original_content:
    if content[:11] == "Redirection":
        alt_content = "Redirection\n\nTitle | Link | Target | Keywords\n------|------|-------|-------\n"
        for key_str in sorted(list(redirection_dict.keys()),key=lambda x:redirection_dict[x]["title"]):
            value_dict = redirection_dict[key_str]
            ti_s = value_dict["title"]
            li_t = value_dict["link"].split("://")[-1]
            li_s = value_dict["link"]
            ta_s = value_dict["target"].split("://")[-1]
            ta_l = ta_s.replace("/","~~/~~").replace(".","~~.~~").split("~~")
            tb_l = [desc(n) for n in ta_l]
            tb_s = "".join(tb_l)
            tc_s = value_dict["target"]
            tbl_l = []
            null = [tbl_l.extend([desc(k) for k in n]) for n in reverseShortDict[key_str].values()]
            tbl_s = ", ".join(sorted(list(set(tbl_l))))
            alt_content += f"{ti_s} | [{li_t}]({li_s}) | [{tb_s}]({tc_s}) | {tbl_s}\n"
            new_table.append("<tr>")
            new_table.append(f"<td>{ti_s}</td>")
            new_table.append(f"<td><a href=\"{li_s}\">{li_t}</a></td>")
            new_table.append(f"<td><a href=\"{tc_s}\">{tb_s}</a></td>")
            new_table.append(f"<td>{tbl_s}</td>")
            new_table.append("</tr>")
        alt_content += "\n"
        new_content.append(alt_content)
    else:
        new_content.append(content)

with open("./README.md","w",encoding="utf-8") as readme_handle:
    readme_handle.write("## ".join(new_content))

new_table.append("</table>")
template_str = open("link.template").read()
tz_element = timezone(timedelta(hours=8),name="UTC+8")
with open("./link/tool-table.html","w",encoding="utf-8") as readme_handle:
    readme_handle.write(template_str.format(date=datetime.now(tz=tz_element).isoformat(),table="\n".join(new_table)+"\n"))
