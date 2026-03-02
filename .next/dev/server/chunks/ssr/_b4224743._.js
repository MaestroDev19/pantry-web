module.exports = [
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://kzmwnltiqzjwfwjftqju.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_Smk74XF-tH8eKMDjnwP0jQ_4U3ziFRt"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/types/authtypes.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InitialAuthActionResult",
    ()=>InitialAuthActionResult,
    "getUserFromClaims",
    ()=>getUserFromClaims
]);
const InitialAuthActionResult = {
    ok: false
};
function getUserFromClaims(claims) {
    return {
        id: claims.sub,
        email: claims.email ?? null,
        user_metadata: claims.user_metadata ?? {}
    };
}
}),
"[project]/constants/tables.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HOUSEHOLD_MEMBERS_TABLE",
    ()=>HOUSEHOLD_MEMBERS_TABLE,
    "PROFILES_TABLE",
    ()=>PROFILES_TABLE
]);
const HOUSEHOLD_MEMBERS_TABLE = "household_members";
const PROFILES_TABLE = "profiles";
}),
"[project]/lib/dal/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSessionToken",
    ()=>getSessionToken,
    "getUserClaims",
    ()=>getUserClaims,
    "getUserProfile",
    ()=>getUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$authtypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/authtypes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$tables$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/tables.ts [app-rsc] (ecmascript)");
;
;
;
;
const getUserClaims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        const { data, error } = await supabase.auth.getClaims();
        if (error || !data?.claims) return null;
        return {
            user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$authtypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserFromClaims"])(data.claims)
        };
    } catch  {
        return null;
    }
});
const getUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (userId)=>{
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from(__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$tables$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROFILES_TABLE"]).select("id, email, full_name, avatar_url").eq("id", userId).single();
    if (error || !data) return null;
    return {
        user: {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            avatar_url: data.avatar_url
        }
    };
});
const getSessionToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
            return {
                message: error?.message ?? "Failed to get session",
                redirect: "/"
            };
        }
        return {
            token: session.access_token
        };
    } catch (err) {
        if (err instanceof Error) {
            return {
                message: err.message,
                redirect: "/"
            };
        }
        return {
            message: "Unknown error",
            redirect: "/"
        };
    }
});
}),
"[project]/actions/household.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PERSONAL_HOUSEHOLD_NAME",
    ()=>PERSONAL_HOUSEHOLD_NAME,
    "createPersonalHousehold",
    ()=>createPersonalHousehold,
    "getMembershipByUserId",
    ()=>getMembershipByUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$tables$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/tables.ts [app-rsc] (ecmascript)");
;
const HOUSEHOLDS_CREATE_PATH = "/households/create";
const PERSONAL_HOUSEHOLD_NAME = "Personal Household";
const ALREADY_MEMBER_MESSAGE = "already a member";
async function getMembershipByUserId(supabase, userId) {
    const { data, error } = await supabase.from(__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$tables$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HOUSEHOLD_MEMBERS_TABLE"]).select("household_id").eq("user_id", userId).maybeSingle();
    return {
        data: data,
        error: error ? {
            message: error.message,
            code: error.code,
            hint: error.hint
        } : null
    };
}
async function createPersonalHousehold(apiBaseUrl, token, payload = {
    name: PERSONAL_HOUSEHOLD_NAME,
    is_personal: true
}) {
    const base = apiBaseUrl.replace(/\/$/, "");
    const url = `${base}${HOUSEHOLDS_CREATE_PATH}`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    if (res.ok) return {
        ok: true
    };
    const errorText = await res.text();
    const alreadyMember = res.status === 400 && errorText.includes(ALREADY_MEMBER_MESSAGE);
    return {
        ok: false,
        alreadyMember
    };
}
;
}),
"[project]/lib/auth-errors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isRefreshTokenNotFound",
    ()=>isRefreshTokenNotFound
]);
const REFRESH_TOKEN_NOT_FOUND_KEY = "NEXT_PUBLIC_REFRESH_TOKEN_NOT_FOUND_CODE";
function isRefreshTokenNotFound(err) {
    const expectedCode = ("TURBOPACK compile-time value", "refresh_token_not_found");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return err !== null && typeof err === "object" && "code" in err && err.code === expectedCode;
}
}),
"[project]/lib/config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiBaseUrl",
    ()=>getApiBaseUrl
]);
const API_URL_KEY = "NEXT_PUBLIC_API_URL";
function getApiBaseUrl() {
    const url = ("TURBOPACK compile-time value", "http://127.0.0.1:8000");
    if (!url || typeof url !== "string") return undefined;
    return url.trim() || undefined;
}
}),
"[project]/lib/session.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSafeSessionToken",
    ()=>getSafeSessionToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dal$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dal/auth.ts [app-rsc] (ecmascript)");
;
async function getSafeSessionToken() {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dal$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSessionToken"])();
    if ("token" in result) return result.token;
    return null;
}
}),
"[project]/lib/checks/household.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"6099e830bab35c90e8b84bda229cfda15d5668579f":"checkForHouseholdMembership"},"",""] */ __turbopack_context__.s([
    "checkForHouseholdMembership",
    ()=>checkForHouseholdMembership
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/household.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-errors.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const MEMBERSHIP_NOT_FOUND_KEY = "NEXT_PUBLIC_MEMBERSHIP_NOT_FOUND_CODE";
function isIgnorableMembershipError(code) {
    const expectedCode = ("TURBOPACK compile-time value", "42P17");
    return typeof expectedCode === "string" && code === expectedCode;
}
function logMembershipError(context, err) {
    if (err.message ?? err.code ?? err.hint) {
        console.error(context, err);
    }
}
async function checkForHouseholdMembership(userId, supabaseInstance) {
    const apiBase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getApiBaseUrl"])();
    if (!apiBase) {
        console.error("API base URL not configured; skipping household check.");
        return;
    }
    const supabase = supabaseInstance ?? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: membership, error: membershipError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMembershipByUserId"])(supabase, userId);
    if (membershipError) {
        if (isIgnorableMembershipError(membershipError.code)) {
            return;
        }
        logMembershipError("Error checking membership:", membershipError);
        return;
    }
    if (membership) return;
    try {
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSafeSessionToken"])();
        if (!token) return;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPersonalHousehold"])(apiBase, token);
        if (!result.ok && !result.alreadyMember) {
            console.error("Failed to create household.");
        }
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRefreshTokenNotFound"])(err)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
        }
        console.error("Failed to create household membership:", err);
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    checkForHouseholdMembership
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkForHouseholdMembership, "6099e830bab35c90e8b84bda229cfda15d5668579f", null);
}),
"[project]/lib/dashboard.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDashboardData",
    ()=>getDashboardData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dal$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dal/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$checks$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/checks/household.ts [app-rsc] (ecmascript)");
;
;
;
const getDashboardData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const userClaims = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dal$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserClaims"])();
    if (!userClaims) return null;
    const userId = userClaims.user.id;
    const [userProfile] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dal$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"])(userId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$checks$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkForHouseholdMembership"])(userId)
    ]);
    if (!userProfile) return null;
    return {
        userClaims,
        userProfile
    };
});
}),
"[project]/app/dashboard/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout,
    "iframeHeight",
    ()=>iframeHeight
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dashboard.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
const iframeHeight = "800px";
async function DashboardLayout({ children }) {
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDashboardData"])();
    if (!data) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "[--header-height:calc(--spacing(14))]",
        children: children
    }, void 0, false, {
        fileName: "[project]/app/dashboard/layout.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_b4224743._.js.map