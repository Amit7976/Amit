"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationProvider = void 0;
const vscode_1 = require("vscode");
/**
 * Provide configuration which affects the execution behavior of hungry delete and smart backspace, not the "when" condition
 *
 * 1. Provide a TypeSafe config object, meanwhile caches the configuration
 * 2. Stub the config without actually reading the vscode workspace config (For testing purpose)
 *
 */
class ConfigurationProvider {
    // TODO: May be a better way to handle this
    // "C:\Users\jason\AppData\Local\Programs\Microsoft VS Code\resources\app\extensions\json\package.json"
    constructor(config) {
        /**
         * Set the configuration of internal config object
         *
         * @memberof ConfigurationProvider
         */
        this.setConfiguration = (config) => {
            this.config = config;
        };
        this._mapIndentionRules = (json) => {
            let increaseIndentPattern, decreaseIndentPattern;
            if (json) {
                if (json.increaseIndentPattern) {
                    increaseIndentPattern = new RegExp(json.increaseIndentPattern);
                }
                if (json.decreaseIndentPattern) {
                    decreaseIndentPattern = new RegExp(json.decreaseIndentPattern);
                }
                return {
                    increaseIndentPattern: increaseIndentPattern,
                    decreaseIndentPattern: decreaseIndentPattern
                };
            }
            return undefined;
        };
        this._mapLanguageConfig = (json) => {
            const languageId = json.languageId;
            const indentationRules = this._mapIndentionRules(json.indentationRules);
            return {
                languageId: languageId,
                indentationRules: indentationRules
            };
        };
        this._getLanguageConfigurations = () => {
            const jsonArray = vscode_1.workspace.getConfiguration().get('hungryDelete.languageConfigurations');
            if (jsonArray) {
                return jsonArray.map(json => this._mapLanguageConfig(json));
            }
            return undefined;
        };
        /**
         * Attach listener which listen the workspace configuration change
         */
        this.listenConfigurationChange = () => {
            this.workspaceListener = vscode_1.workspace.onDidChangeConfiguration((e) => {
                if (e.affectsConfiguration("hungryDelete")) {
                    this._resetConfiguration();
                    console.log("Reset hungry delete configuration");
                }
            });
        };
        /**
         * Remove listener which listen the workspace configuration change in order to prevent memory leak
         */
        this.unListenConfigurationChange = () => {
            if (this.workspaceListener) {
                this.workspaceListener.dispose();
            }
        };
        /**
         * If internal configuration object exists, use it.
         *
         * Otherwise, use workspace configuration settings (Lazy loading of the config)
         *
         * @memberof ConfigurationProvider
         */
        this.getConfiguration = () => {
            if (this.config) {
                return this.config;
            }
            const workspaceConfig = vscode_1.workspace.getConfiguration('hungryDelete');
            this.config = {
                keepOneSpace: workspaceConfig.get('keepOneSpace'),
                keepOneSpaceException: workspaceConfig.get('keepOneSpaceException'),
                coupleCharacters: ConfigurationProvider.coupleCharacters,
                considerIncreaseIndentPattern: workspaceConfig.get('considerIncreaseIndentPattern'),
                followAboveLineIndent: workspaceConfig.get('followAboveLineIndent'),
                languageConfigurations: this._getLanguageConfigurations(),
            };
            return this.config;
        };
        /**
         * Clear the internal configuration cache
         *
         * @private
         * @memberof ConfigurationProvider
         */
        this._resetConfiguration = () => {
            this.config = null;
        };
        this.config = config;
    }
    isStartCoupleCharacters(charB) {
        if (charB === "(") {
            return true;
        }
        if (charB === "[") {
            return true;
        }
        if (charB === "<") {
            return true;
        }
        if (charB === "{") {
            return true;
        }
        if (charB === "'") {
            return true;
        }
        if (charB === "`") {
            return true;
        }
        if (charB === '"') {
            return true;
        }
        return false;
    }
    isEndCoupleCharacters(charB) {
        if (charB === ")") {
            return true;
        }
        if (charB === "]") {
            return true;
        }
        if (charB === ">") {
            return true;
        }
        if (charB === "}") {
            return true;
        }
        if (charB === "'") {
            return true;
        }
        if (charB === "`") {
            return true;
        }
        if (charB === '"') {
            return true;
        }
        return false;
    }
    isMatchOpenCoupleCharacters(charA, charB) {
        if (charA === "(" && charB === ")") {
            return true;
        }
        if (charA === "[" && charB === "]") {
            return true;
        }
        if (charA === "<" && charB === ">") {
            return true;
        }
        if (charA === "{" && charB === "}") {
            return true;
        }
        if (charA === "'" && charB === "'") {
            return true;
        }
        if (charA === "`" && charB === "`") {
            return true;
        }
        if (charA === '"' && charB === '"') {
            return true;
        }
        return false;
    }
    isKeepOneSpaceException(char) {
        const config = this.getConfiguration();
        if (!config.keepOneSpaceException) {
            return false;
        }
        return config.keepOneSpaceException.indexOf(char) >= 0;
    }
    increaseIndentAfterLine(textLine, languageId) {
        const config = this.getConfiguration();
        if (!config.considerIncreaseIndentPattern) {
            return false;
        }
        const languageConfigs = config.languageConfigurations.filter(langConfig => langConfig.languageId === languageId);
        if (languageConfigs.length > 0) {
            const langConfig = languageConfigs[0];
            if (langConfig.indentationRules) {
                return langConfig.indentationRules.increaseIndentPattern.test(textLine.text);
            }
        }
        return false;
    }
}
exports.ConfigurationProvider = ConfigurationProvider;
// TODO: May be a better way to handle this
// they are called auto close pair in vscode configuration
ConfigurationProvider.coupleCharacters = [
    "()",
    "[]",
    "<>",
    "{}",
    "''",
    "``",
    '""',
];
/**
  *Get the default configuration, must be aligned with the value in settings.json
 *
 * @memberof ConfigurationProvider
 */
ConfigurationProvider.getDefaultConfiguration = () => {
    return {
        keepOneSpace: false,
        coupleCharacters: ConfigurationProvider.coupleCharacters
    };
};
//# sourceMappingURL=ConfigurationProvider.js.map