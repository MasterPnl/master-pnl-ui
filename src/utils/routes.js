import {roles} from "@/utils/roles.js";

export default {
    ROOT: {path: "/"},
    LOGIN: {path: "/giris"},
    NOT_FOUND: {path: "*"},
    USER_MANAGEMENT: {path: "/kullanici-yonetimi", roles: [roles.ADMIN]},
    PANEL_MANAGEMENT: {path: "/panel-yonetimi", roles: [roles.ADMIN]},
    USER_PANEL_MANAGEMENT: {path: "/kullanici-panel-yonetimi", roles: [roles.ADMIN]},
    REPORT: {path: "/raporlar", roles: [roles.ADMIN, roles.USER]},
    LISTING: {path: "/ilan-yonetimi", roles: [roles.USER]},
};
