import { Profile } from "./profile";
export class SettingsParser {
    private jsonData : string;
    constructor(jsonData: string) {
        this.jsonData = jsonData;
    }

    convert() : Map<string,Profile> {
        interface ProfileObj {
            name: string;
            conanFile: string;
            profile: string;
            installArg: string;
            buildArg: string;
            createArg: string;
            createUser: string;
            createChannel: string;
        }
 
        let jsonObj: { profiles: ProfileObj[] } = JSON.parse(this.jsonData);
        var profiles = new Map<string,Profile>();
        jsonObj.profiles.forEach(function (profileJson) {
            let profile = new Profile(profileJson.name,
                                      profileJson.conanFile, 
                                      profileJson.profile,
                                      profileJson.installArg,
                                      profileJson.buildArg,
                                      profileJson.createArg,
                                      profileJson.createUser,
                                      profileJson.createChannel);
            profiles.set(profileJson.name,profile);
          });
        return new Map(profiles);
    }

}