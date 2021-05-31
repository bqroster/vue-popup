module.exports = {
    verbose: true,
    roots: [
        "<rootDir>/__tests__"
    ],
    "moduleFileExtensions": [
        "js",
        "json",
        "vue" // tell Jest to handle `*.vue` files
    ],
    "transform": {
        "^.+\\.js$": "babel-jest",
        "^.+\\.vue$": "vue-jest"
    },
    "moduleDirectories": ["node_modules"],
    "moduleNameMapper": {
        "^~(.*)$": "<rootDir>/src/$1",
    }
};