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
"[project]/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00b22dfbfde4986d821af81fd159e39cd107d82185":"getUserAccessToken","00dfb4763b0b045b288223bc3d869342e8d14b664e":"getUserClaims","407c5fcac14f8c66ab0032b3c05a07e5585ca35aca":"signInWithEmail","40b7eb160bf3da9ceb9af1df2a86058a41f11b93e4":"getUserProfile","40c26003ea512739202f9a611195947e40e774980c":"signUpWithEmail"},"",""] */ __turbopack_context__.s([
    "getUserAccessToken",
    ()=>getUserAccessToken,
    "getUserClaims",
    ()=>getUserClaims,
    "getUserProfile",
    ()=>getUserProfile,
    "signInWithEmail",
    ()=>signInWithEmail,
    "signUpWithEmail",
    ()=>signUpWithEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$authtypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/authtypes.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const PROFILES_TABLE = "profiles";
async function signInWithEmail(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
    });
    if (error || !user) {
        return {
            ok: false,
            message: error?.message
        };
    }
    return {
        ok: true,
        redirect: "/dashboard"
    };
}
async function signUpWithEmail(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.name
            }
        }
    });
    if (error) {
        return {
            ok: false,
            message: error?.message
        };
    }
    return {
        ok: true,
        redirect: "/confirm"
    };
}
async function getUserAccessToken() {
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
}
async function getUserClaims() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        const { data, error } = await supabase.auth.getClaims();
        if (error || !data?.claims) {
            return null;
        }
        return {
            user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$authtypes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserFromClaims"])(data.claims)
        };
    } catch  {
        return null;
    }
}
async function getUserProfile(userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from(PROFILES_TABLE).select("id, email, full_name, avatar_url").eq("id", userId).single();
    if (error || !data) {
        return null;
    }
    return {
        user: {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            avatar_url: data.avatar_url
        }
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signInWithEmail,
    signUpWithEmail,
    getUserAccessToken,
    getUserClaims,
    getUserProfile
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signInWithEmail, "407c5fcac14f8c66ab0032b3c05a07e5585ca35aca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signUpWithEmail, "40c26003ea512739202f9a611195947e40e774980c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserAccessToken, "00b22dfbfde4986d821af81fd159e39cd107d82185", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserClaims, "00dfb4763b0b045b288223bc3d869342e8d14b664e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfile, "40b7eb160bf3da9ceb9af1df2a86058a41f11b93e4", null);
}),
"[project]/constants/tables.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HOUSEHOLD_MEMBERS_TABLE",
    ()=>HOUSEHOLD_MEMBERS_TABLE
]);
const HOUSEHOLD_MEMBERS_TABLE = "household_members";
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

/* __next_internal_action_entry_do_not_use__ [{"0035cbb971fabfef242a0b95f9a5bac7de5ac97079":"getSafeSessionToken"},"",""] */ __turbopack_context__.s([
    "getSafeSessionToken",
    ()=>getSafeSessionToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getSafeSessionToken() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.access_token;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getSafeSessionToken
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSafeSessionToken, "0035cbb971fabfef242a0b95f9a5bac7de5ac97079", null);
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
"[project]/.next-internal/server/app/(app)/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/checks/household.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/lib/session.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$checks$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/checks/household.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(app)/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/checks/household.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/lib/session.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0035cbb971fabfef242a0b95f9a5bac7de5ac97079",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSafeSessionToken"],
    "00b22dfbfde4986d821af81fd159e39cd107d82185",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserAccessToken"],
    "00dfb4763b0b045b288223bc3d869342e8d14b664e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserClaims"],
    "407c5fcac14f8c66ab0032b3c05a07e5585ca35aca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signInWithEmail"],
    "40b7eb160bf3da9ceb9af1df2a86058a41f11b93e4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"],
    "40c26003ea512739202f9a611195947e40e774980c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signUpWithEmail"],
    "6099e830bab35c90e8b84bda229cfda15d5668579f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$checks$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkForHouseholdMembership"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$app$292f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$lib$2f$checks$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(app)/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/lib/checks/household.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/lib/session.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$checks$2f$household$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/checks/household.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_3be4f56b._.js.map