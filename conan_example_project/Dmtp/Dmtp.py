import inspect
import marshmallow.validate
import networkx as nx
import os
import pathlib
import re
import shutil
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional


# https://mungingdata.com/python/dag-directed-acyclic-graph-networkx/
def composeGraphs(graphs):
    composed = graphs[0]
    if len(graphs) >= 2:
        for graph in graphs[1:]:
            composed = nx.compose(composed, graph)
    return composed


def find_roots(composed):
    # https://stackoverflow.com/questions/62468287/finding-all-the-roots-inside-a-digraph-networkx
    roots = []
    for component in nx.weakly_connected_components(composed):
        composed_sub = composed.subgraph(component)
        roots.extend([n for n, d in composed_sub.in_degree() if d == 0])
    return roots


def buildOrder(graph):
    return {list(nx.topological_sort(graph))}

    # roots = find_roots()
    # print(f"Roots      : {roots}")
    # print(f"Is Directed: {nx.is_directed(composed)}")
    # print(f"Nodes      : {composed.nodes()}")
    # print(f"Edged      : {composed.edges()}")
    # print(f"BuildOrder : {list(nx.topological_sort(composed))}")


def run(cmd):
    print(f"run: {cmd}")
    if os.system(cmd) != 0:
        raise Exception('System command \"' + cmd + '\" failed')


def absPathw(file):
    return pathlib.Path(file).parent.absolute()


class Dmtp(object):

    def __init__(self, recipes, profiles, user, channel, version):
        self.recipes = recipes
        self.profiles = profiles
        self.user = user
        self.channel = channel
        self.version = version
        self.buildFolder = "build"

    def local_dev(self):
        ret: list[LocalDev] = []
        for profile in self.profiles:
            for recipe in self.recipes:
                d = LocalDev(recipe, profile, self.user, self.channel, self.version)
                ret.append(d)
        return ret

    def clean(self):
        print(f"run clean")
        build_dir = "build"
        dirpath = Path(f"./{build_dir}")
        if dirpath.exists() and dirpath.is_dir():
            shutil.rmtree(dirpath)

    def workspace(self):
        return Workspace(self.recipes, self.profiles[1], self.version, self.user, self.channel)


class LocalDev(object):

    def __init__(self, recipe, profile, user, channel, version):
        self.recipe = recipe
        self.profile = profile
        self.user = user
        self.channel = channel
        self.version = version
        self.recipePath = absPathw(recipe)
        self.recipeName = getRecipeName(recipe)
        self.recipe_reference = f"demo{self.recipeName}/{version}@{user}/{channel}"
        self.buildFolder="build"
        self.buildPath = f"{self.recipePath}/{self.buildFolder}"

    def getRecipeRef(self):
        return self.recipe_reference

    def clean(self):
        print(f"run clean")
        build_dir = "build"
        dirpath = Path(self.buildPath)
        if dirpath.exists() and dirpath.is_dir():
            shutil.rmtree(dirpath)

    def source(self):
        run(f'conan source {self.recipePath} -sf={self.buildPath}/{self.recipeName}/source')

    def install(self):
        run(
            f'conan install {self.recipePath} -if={self.buildPath}/{self.recipeName} -pr={self.profile} -b=missing')

    def build(self):
        run(
            f'conan build {self.recipePath} -sf={self.buildPath}/{self.recipeName}/source -if={self.buildPath}/{self.recipeName} -bf={self.buildPath}/{self.recipeName}')

    def package(self):
        run(
            f'conan package {self.recipePath} -sf={self.buildPath}/{self.recipeName}/source -if={self.buildPath}/{self.recipeName} -bf={self.buildPath}/{self.recipeName} -pf={self.buildPath}/{self.recipeName}/package')

    def exportPkg(self):
        run(
            f'conan export-pkg {self.recipePath} {self.recipe_reference} -sf={self.buildPath}/{self.recipeName}/source -bf={self.buildPath}/{self.recipeName} -pr={self.profile} --force')  # fails with --package-folder={self.buildPath2}}/{n}/package why?if

    def test(self):
        test_path = f"{self.recipePath}/test_package"
        if os.path.exists(test_path):
            # conan new mypackage/1.0@myuser/stable -t -s
            run(f'conan test {test_path} {self.recipe_reference}')

    def create(self):
        run(
            f'conan create -pr={self.profile} {self.recipePath} {self.recipe_reference}  ')


def getRecipeName(recipe):
    # fixme improve and get fieldvalue from Conan derived Class in this file
    absPath = absPathw(recipe)
    basename = os.path.basename(absPath)
    return basename


def fromRecipe():
    pass


def get_graph(recipes):
    # see dagTest.py
    graphs = []
    for recipe in recipes:
        g = fromRecipe()
        graphs.append(g)
    pass


def graphFromRecipe(recipe):
    pass


def get_roots(recipes):
    g = []
    for recipe in recipes:
        graph = graphFromRecipe(recipe)
        g.append(graph)
    graphs = composeGraphs(g)
    roots = find_roots(graphs)
    return roots


def getReference(recipe):
    recipes_ = [sys.modules__file__]
    clsmembers = inspect.getmembers(recipes_, inspect.isclass)

    pass


def getpackagereference(ref, user, channel):
    recipe_reference = f"{ref}@{user}/{channel}"
    return recipe_reference


@dataclass
class Building:
    # field metadata is used to instantiate the marshmallow field
    height: float = field(metadata={"validate": marshmallow.validate.Range(min=0)})
    name: str = field(default="anonymous")


@dataclass
class City:
    name: Optional[str]
    buildings: List[Building] = field(default_factory=list)


def runConanInfoAndGetRef(recipe):
    recipeString = recipe.replace("/", "_").replace(".", "_")
    layoutfileRelPath = f"build/{recipeString}.json"

    batcmd = f"conan info {recipe} -j {layoutfileRelPath} "

    #
    #
    # with open(layoutfileRelPath) as f:
    #     d = json.load(f)
    #     city_schema = marshmallow_dataclass.class_schema(City)()
    #
    #     print(d)
    # for  in d:
    #
    # result = subprocess.check_output(batcmd, shell=True)
    decode = result.decode("utf-8")
    m = re.search('.*conanfile.py .*\((.*)\):.*', decode)
    ref = m.group(1)
    return ref


class Workspace(object):

    def __init__(self, recipes, profile, version, user, channel):
        self.recipes = recipes
        self.profile = profile
        self.version = version
        self.user = user
        self.channel = channel

    def gen(self):
        Path("build").mkdir(parents=True, exist_ok=True)

        ws__layout_file_content = self.generate_layout_file()
        print(ws__layout_file_content)
        layoutfileRelPath = "build/ws_layoutfile"
        layoutfile = open(layoutfileRelPath, "w")
        layoutfile.write(ws__layout_file_content)
        layoutfile.close()
        layoutfilePath = pathlib.Path(layoutfileRelPath).absolute()

        ws_file_content = self.generate_workspace_file(self.recipes, layoutfilePath)
        print(ws_file_content)
        url = "build/ws-file.yml"
        self.wsfile = open(url, "w")
        self.wsfile.write(ws_file_content)
        self.wsfile.close()
        self.wsFileAbs = pathlib.Path(url).absolute()
        return self

    def install(self):
        run(f'conan workspace install {self.wsFileAbs} -pr={self.profile} -if=build --build=missing')
        return self

    def generate_workspace_file(self, recipes, layoutfilePath):
        ws = "editables:\n"

        # graph = get_graph(recipes)
        # nodes = get_nodes(recipes)
        # for recipe in recipes:
        # for node in nodes:
        # hier recipe_reference erhalten
        # alle nötigen argumente übergeben
        # recipeName = getRecipeName(recipe,v)
        # ref = runConanInfoAndGetRef(recipe)
        # package_reference = getpackagereference(ref, self.user, self.channel)
        # path = absPathw(recipe)
        # ws += f"    {package_reference}:\n"
        # ws += f"        path: {path}\n"
        ws += "    demoa/0.1@disroop/development:\n"
        ws += "        path: ../a\n"
        ws += "    demob/0.1@disroop/development:\n"
        ws += "        path: ../b\n"
        ws += "    democ/0.1@disroop/development:\n"
        ws += "        path: ../c\n"
        ws += f"layout: {layoutfilePath}\n"
        ws += f"layout: ws_layoutfile\n"
        ws += "workspace_generator: cmake\n"
        ws += "root: \n"
        # roots = get_roots(recipes)
        # for root in roots:
        #     ws += f"    - {root}:\n"  # fixme
        ws += "    - democ/0.1@disroop/development\n"  # fixme
        return ws

    def generate_layout_file(self):
        lf = "[build_folder]\n"
        lf += "build/ws-{{reference.name}}/{{settings.build_type}}/{{settings.os}}\n"
        lf += "[includedirs]\n"
        lf += "src\n"
        lf += "[source_folder]\n"
        lf += "[libdirs]\n"
        lf += "build/ws-{{reference.name}}/{{settings.build_type}}/{{settings.os}}/lib\n"
        lf += "[bindirs]\n"
        lf += "build/ws-{{reference.name}}/{{settings.build_type}}/{{settings.os}}/bin\n"
        return lf

# spec = importlib.util.spec_from_file_location("module.name", "/Users/stefaneicher/CLionProjects/vs-code-conan/conan_example_project/a/conanfile.py")
# foo = importlib.util.module_from_spec(spec)
# spec.loader.exec_module(foo)
#
# isclass = inspect.isclass
# clsmembers = inspect.getmembers(foo, isclass)
# print(clsmembers)
# for clsmember in clsmembers:
#     klass = clsmember[1]
#     subclass = issubclass(klass, ConanFile)
#     if subclass:
#         print("Treffer")
#         inst = klass(None, None)
#         inst_name = inst.name
#         # from.
#
# my_class = foo.AConan()
# name = my_class.name
