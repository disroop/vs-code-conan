from conans import ConanFile


class BConan(ConanFile):
    name = "demob"
    python_requires = "disroopbase/0.1@disroop/development"
    python_requires_extend = "disroopbase.Base"

    requires = "demoa/0.1@disroop/development"

