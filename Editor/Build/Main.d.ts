declare namespace Fudge {
    enum CONTEXTMENU {
        ADD_NODE = 0,
        ACTIVATE_NODE = 1,
        DELETE_NODE = 2,
        ADD_COMPONENT = 3,
        DELETE_COMPONENT = 4,
        ADD_COMPONENT_SCRIPT = 5,
        EDIT = 6,
        CREATE_FOLDER = 7,
        CREATE_MESH = 8,
        CREATE_MATERIAL = 9,
        CREATE_GRAPH = 10,
        CREATE_ANIMATION = 11,
        CREATE_PARTICLE_EFFECT = 12,
        SYNC_INSTANCES = 13,
        REMOVE_COMPONENT = 14,
        ADD_JOINT = 15,
        DELETE_RESOURCE = 16,
        CLONE_RESOURCE = 17,
        ORTHGRAPHIC_CAMERA = 18,
        RENDER_CONTINUOUSLY = 19,
        SELECTION_OUTLINE = 20,
        ADD_PROPERTY = 21,
        DELETE_PROPERTY = 22,
        CONVERT_ANIMATION = 23,
        ADD_PARTICLE_PROPERTY = 24,
        ADD_PARTICLE_FUNCTION = 25,
        ADD_PARTICLE_CONSTANT = 26,
        ADD_PARTICLE_CODE = 27,
        ADD_PARTICLE_TRANSFORMATION = 28,
        DELETE_PARTICLE_DATA = 29
    }
    enum MENU {
        QUIT = "quit",
        PROJECT_NEW = "projectNew",
        PROJECT_SAVE = "projectSave",
        PROJECT_LOAD = "projectLoad",
        DEVTOOLS_OPEN = "devtoolsOpen",
        PANEL_GRAPH_OPEN = "panelGraphOpen",
        PANEL_ANIMATION_OPEN = "panelAnimationOpen",
        PANEL_PROJECT_OPEN = "panelProjectOpen",
        PANEL_HELP_OPEN = "panelHelpOpen",
        PANEL_PARTICLE_SYSTEM_OPEN = "panelParticleSystemOpen",
        FULLSCREEN = "fullscreen"
    }
    enum PANEL {
        GRAPH = "PanelGraph",
        PROJECT = "PanelProject",
        HELP = "PanelHelp",
        ANIMATION = "PanelAnimation",
        PARTICLE_SYSTEM = "PanelParticleSystem"
    }
    enum VIEW {
        HIERARCHY = "ViewHierarchy",
        ANIMATION = "ViewAnimation",
        ANIMATION_SHEET = "ViewAnimationSheet",
        RENDER = "ViewRender",
        COMPONENTS = "ViewComponents",
        CAMERA = "ViewCamera",
        INTERNAL_TABLE = "ViewInternalTable",
        INTERNAL_FOLDER = "ViewInternalFolder",
        EXTERNAL = "ViewExternal",
        PROPERTIES = "ViewProperties",
        PREVIEW = "ViewPreview",
        SCRIPT = "ViewScript",
        PARTICLE_SYSTEM = "ViewParticleSystem"
    }
    enum TRANSFORM {
        NONE = "none",
        TRANSLATE = "translate",
        ROTATE = "rotate",
        SCALE = "scale",
        WORLD = "world",
        LOCAL = "local"
    }
}
/**
 * Main electron application running node. Starts the browser window to contain Fudge and sets up the main menu.
 * See subfolder Fudge for most of the other functionality
 */
declare namespace Main {
}
