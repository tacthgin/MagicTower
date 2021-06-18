# coding=utf-8

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

import math
import json
import os
import re
import sys
import shutil

# 地图信息
map_info = {}

# 图片id转数据id
tile_to_element_data = None


def init():
    global tile_to_element_data
    # 读取本地配置
    try:
        with open("tileToElement.json", "r", encoding="utf-8") as f:
            tile_to_element_data = json.loads(f.read())
            return True
    except FileNotFoundError:
        print("错误", "tileToElement " + "文件没找到")
        return False
    return False

# 分割字符串转为数组


2


def split_to_int_array(str_data, symbol):
    # 整型处理
    return [int(value) for value in str.split(str_data, symbol)]

# 获取layer


def get_layer(root, name):
    for layer in root.findall("layer"):
        if layer.get("name") == name:
            return layer
    return None

# 获取属性和data数据


def get_layer_data(layer):
    if layer == None:
        return None

    data = {}
    for layer_data in layer:
        if layer_data.tag == "properties":
            data[layer_data.tag] = {}
            for layer_property in layer_data:
                data[layer_data.tag][layer_property.attrib["name"]
                                     ] = layer_property.attrib["value"]
        elif layer_data.tag == "data":
            data[layer_data.tag] = layer_data.text

    return data

# 解析层的data数据转换为数组


def parse_layer_data(data):
    if data == None:
        return None

    data_array = str.split(data.strip("\n"), "\n")
    for i in range(len(list(data_array))):
        data_array[i] = split_to_int_array(data_array[i].strip(","), ",")

    return data_array


def parse_wall(layer):
    data = get_layer_data(layer)
    if data == None:
        return None

    wall_info = {}

    # 解析data数据
    data_array = parse_layer_data(data["data"])
    if data_array != None:
        for y in range(len(data_array)):
            for x in range(len(data_array[0])):
                value = data_array[y][x]
                if value != 0 and str(value - 1) in tile_to_element_data:
                    buildingName = tile_to_element_data[str(
                        value - 1)]["elementId"]
                    if buildingName == 1006:
                        buildingName = "door1006_0"
                    if buildingName in wall_info:
                        wall_info[buildingName].append(
                            x + y * len(data_array[0]))
                    else:
                        wall_info[buildingName] = []
                        wall_info[buildingName].append(
                            x + y * len(data_array[0]))

        return wall_info

    return None


def parse_building(layer):
    data = get_layer_data(layer)
    if data == None:
        return None

    building_info = []

    # 解析data数据
    data_array = parse_layer_data(data["data"])
    if data_array != None:
        for y in range(len(data_array)):
            for x in range(len(data_array[0])):
                value = data_array[y][x]
                if value != 0:
                    building_info.append(x + y * len(data_array[0]))

        return building_info

    return None


def parse_stair(layer):
    data = get_layer_data(layer)
    if data == None:
        return None

    stair_info = {}
    stair_location = {}
    if "properties" in data:
        if "location" in data["properties"]:

            stair_array = split_to_int_array(
                data["properties"]["location"], ",")
            stair_location["up"] = []
            stair_location["down"] = []
            for i in range(len(stair_array)):
                if i % 2 == 0:
                    stair_location["up"].append(stair_array[i])
                else:
                    stair_location["down"].append(stair_array[i])

        if "hide" in data["properties"]:
            stair_info["hide"] = split_to_int_array(
                data["properties"]["hide"], ",")

    # 解析data数据
    data_array = parse_layer_data(data["data"])
    count = 0
    if data_array != None:
        for y in range(len(data_array)):
            for x in range(len(data_array[0])):
                value = data_array[y][x]
                # tileId再map里会加一
                if value != 0 and str(value - 1) in tile_to_element_data:
                    assert(len(stair_location) > 0)
                    stair_name = tile_to_element_data[str(
                        value - 1)]["elementId"]
                    stair_info[stair_name] = [
                        x + y * len(data_array[0]), stair_location[stair_name]]
                    count += 1

        return stair_info

    return None


def parse_door(layer, level):
    data = get_layer_data(layer)
    if data == None:
        return None

    door_info = {}

    # 解析data数据
    data_array = parse_layer_data(data["data"])
    if data_array != None:
        door_array = []
        for y in range(len(data_array)):
            for x in range(len(data_array[0])):
                value = data_array[y][x]
                # tileId再map里会加一
                if value != 0 and str(value - 1) in tile_to_element_data:
                    door_array.append(
                        [x + y * len(data_array[0]), tile_to_element_data[str(value - 1)]["elementId"]])
        door_info["tile"] = door_array

    # 解析properties
    if "properties" in data:
        monster = {}
        # key 门的index，value monster数组
        for key in data["properties"]:
            if key == "passive" or key == "appear" or key == "hide":
                door_info[key] = split_to_int_array(
                    data["properties"][key], ",")
            elif key == "appearEvent":
                if level == 23:
                    print("23 null")
                else:
                    door_info["appearEvent"] = {}
                    appearEventArray = str.split(data["properties"][key], ":")
                    door_info["appearEvent"][appearEventArray[0]
                                             ] = split_to_int_array(appearEventArray[1], ",")
            elif key == "disappearEvent":
                door_info[key] = {}
                disappearEventArray = str.split(data["properties"][key], ":")
                if len(disappearEventArray) == 3:
                    door_info[key][disappearEventArray[1]] = {
                        "condition": split_to_int_array(disappearEventArray[0], ","),
                        "tile": split_to_int_array(disappearEventArray[2], ",")
                    }
            elif key == "monsterCondition":
                door_info[key] = {}
                monsterCondition = str.split(data["properties"][key], ":")
                door_info[key][monsterCondition[0]] = monsterCondition[1]
            else:
                monster[data["properties"][key]] = split_to_int_array(key, ",")

        if monster:
            door_info["monster"] = monster

    if level == 23:
        door_info["appear"] = []
        for value in door_info["tile"]:
            door_info["appear"].append(value[0])
        door_info["appearEvent"] = {}
        door_info["appearEvent"][data["properties"]
                                 ["appearEvent"]] = door_info["appear"]

    return door_info


def parse_monster(layer):
    data = get_layer_data(layer)
    if data == None:
        return None

    monster_info = {}

    if "properties" in data:
        if "monsterEvent" in data["properties"]:
            monster_info["monsterEvent"] = {}
            event = str.split(data["properties"]["monsterEvent"], ":")
            monster_info["monsterEvent"][event[0]
                                         ] = {
                                             "condition": split_to_int_array(event[2], ",") if len(event) == 3 else None,
                                             "tile": split_to_int_array(event[1], ",")}
        if "firstAttack" in data["properties"]:
            monster_info["firstAttack"] = split_to_int_array(
                data["properties"]["firstAttack"], ",")

        if "monsterMove" in data["properties"]:
            monster_info["monsterMove"] = split_to_int_array(
                data["properties"]["monsterMove"], ",")

    # 解析data数据
    data_array = parse_layer_data(data["data"])
    if data_array != None:
        monster_array = []
        for y in range(len(data_array)):
            for x in range(len(data_array[0])):
                value = data_array[y][x]
                # tileId再map里会加一
                if value != 0 and str(value - 1) in tile_to_element_data:
                    monster_array.append(
                        [x + y*len(data_array[0]), tile_to_element_data[str(value - 1)]["elementId"]])
        monster_info["tile"] = monster_array

    if monster_info:
        return monster_info
    return None


def parse_damage(layer):
    data = get_layer_data(layer)
    if data == None:
        return None

    damage_info = {}

    if "properties" in data:
        for index in data["properties"]:
            damage_info[int(index)] = split_to_int_array(
                data["properties"][index], ",")

        return damage_info
    return None


def parse_properties(layer):
    data = get_layer_data(layer)
    if data == None:
        return None

    info = None

    # 解析properties
    if "properties" in data:
        info = []
        for index in data["properties"]:
            info.append([int(index), int(data["properties"][index])])

    return info


def parse_common(layer):
    data = get_layer_data(layer)
    if data == None:
        return None

    # 解析data数据
    data_array = parse_layer_data(data["data"])
    if data_array != None:
        common_array = []
        for y in range(len(data_array)):
            for x in range(len(data_array[0])):
                value = data_array[y][x]
                # tileId再map里会加一
                if value != 0 and str(value - 1) in tile_to_element_data:
                    common_array.append(
                        [x + y * len(data_array[0]), tile_to_element_data[str(value - 1)]["elementId"]])
        return common_array

    return None

# 封装层数据


def package_layer(info, layer_info, layer_name):
    info[layer_name] = layer_info

# 解析层


def parse_layer(root, level):
    info = {
        "level": level,
        "row": int(root.attrib["width"]),
        "column": int(root.attrib["height"]),
        "mapWidth": int(root.attrib["tilewidth"]) * int(root.attrib["width"]),
        "mapHeight": int(root.attrib["tileheight"]) * int(root.attrib["height"]),
        "tileWidth": int(root.attrib["tilewidth"]),
        "tileHeight": int(root.attrib["tileheight"]),
        "layer": {}
    }

    print(level)

    package_layer(info["layer"], parse_wall(get_layer(root, "wall")), "wall")

    package_layer(info["layer"], parse_door(
        get_layer(root, "door"), level), "door")

    package_layer(info["layer"], parse_monster(
        get_layer(root, "monster")), "monster")

    package_layer(info["layer"], parse_common(get_layer(root, "prop")), "prop")
    package_layer(info["layer"], parse_stair(
        get_layer(root, "stair")), "stair")
    package_layer(info["layer"], parse_properties(
        get_layer(root, "event")), "event")
    package_layer(info["layer"], parse_properties(
        get_layer(root, "npc")), "npc")
    package_layer(info["layer"], parse_building(
        get_layer(root, "building")), "building")
    package_layer(info["layer"], parse_properties(
        get_layer(root, "event")), "event")
    package_layer(info["layer"], parse_damage(
        get_layer(root, "damage")), "damage")

    return info

# 读取tilemap


def read_tmx(tmx_file):
    try:
        tree = ET.parse(tmx_file)
    except FileNotFoundError:
        print("错误", tmx_file + "文件没找到")
        return
    root = tree.getroot()

    level = tmx_file[:-4]
    map_info[level] = parse_layer(root, int(level))


def save_json():
    jsonarray = json.dumps(map_info)
    with open('map.json', "w+", encoding="utf-8") as f:
        f.write(jsonarray)


def visit_dir(dir):
    for file_name in os.listdir(dir):
        abs_name = os.path.join(dir, file_name)
        if not os.path.isdir(abs_name) and abs_name.find(".tmx") != -1:
            read_tmx(file_name)
    save_json()


if __name__ == "__main__":
    if init():
        visit_dir(os.getcwd())
