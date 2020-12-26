from build import get_graph, get_roots


class Dmtp(object):

    def __init__(self, recipes, profiles, user, channel, version):
        self.recipes = recipes
        self.profiles = profiles
        self.user = user
        self.channel = channel
        self.version = version

    def local_dev(self):
        ret: list[LocalDev] = []
        dev = LocalDev()
        dev2 = LocalDev()
        ret.append(dev)
        ret.append(dev2)
        return ret

    def clean(self):
        print(f"run clean")
        #
        # dirpath = os.path.join('dataset3', 'dataset')
        # if os.path.exists(dirpath) and os.path.isdir(dirpath):
        #     shutil.rmtree(dirpath)
        #
        #     def workspace(self):
        return Workspace(self.profile)


class LocalDev(object):
    pass


class Workspace(object, ):
    def gen(self):
        ws_file_content = self.generate_workspace_file(self.recipies)
        print(ws_file_content)
        f = open("ws-gen.yml", "w")
        f.write(ws_file_content)
        f.close()
        return self

    def install(self):
        return self

    def generate_workspace_file(self, recipes):
        ws = "editables:\n"

        graph = get_graph(recipes)
        roots = get_roots(graph)
        for r in recipes:
            ws += f"    {r.fullName}:\n"
            ws += f"        path: {r.paths}\n"
        # ws+="    demoa/0.1@disroop/development:\n"
        # ws+="        path: ../../a\n"
        # ws+="    demob/0.1@disroop/development:\n"
        # ws+="        path: ../../b\n"
        # ws+="    democ/0.1@disroop/development:\n"
        # ws+="        path: ../../c\n"
        ws += "layout: layout_linux\n"
        ws += "workspace_generator: cmake\n"
        ws += "root: \n"
        ws += "    - democ/0.1@disroop/development:\n"  # fixme
        return ws
