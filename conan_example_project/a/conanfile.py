from conans import ConanFile


class AConan(ConanFile):
    name = "demoa"
    python_requires = "disroopbase/0.1@disroop/development"
    python_requires_extend = "disroopbase.Base"
