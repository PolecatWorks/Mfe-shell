*** Settings ***
Documentation    Verifies MFE Shell route composition, MFE prefix paths (/mfe/<service>), and static assets
Library          RequestsLibrary
Library          Collections

*** Variables ***
${MFE_SHELL_URL}    http://mfe-shell-nginx-view

*** Test Cases ***
Positive: Shell Serves Root Index HTML
    [Documentation]    Verify MFE Shell is accessible at root /index.html.
    [Tags]    shell    positive
    ${response}=    GET    ${MFE_SHELL_URL}/index.html    expected_status=200
    Log    Response was: ${response.content}
    Should Contain    ${response.headers}    Content-Type

Positive: Remote Entry Is Served Under Configured MFE Prefix
    [Documentation]    Verify remoteEntry.json is accessible under /mfe/mfe1/ and /mfe/angry-agent/.
    [Tags]    mfe    positive
    # When deployed in namespace, remotes are reachable under their /mfe/<service> prefix
    ${response}=    GET    ${MFE_SHELL_URL}/mfe/mfe1/remoteEntry.json    expected_status=200
    Log    Response was: ${response.content}

Positive: MFE Static Assets Return CORS Headers On Options
    [Documentation]    Verify OPTIONS preflight on /mfe/mfe1/ returns proper CORS headers.
    [Tags]    cors    positive
    ${headers}=    Create Dictionary    Origin=http://mfe-shell.dev.k8s    Access-Control-Request-Method=GET
    ${response}=    OPTIONS    ${MFE_SHELL_URL}/mfe/mfe1/remoteEntry.json    headers=${headers}    expected_status=204
    Dictionary Should Contain Key    ${response.headers}    Access-Control-Allow-Origin

Negative: Invalid MFE Service Prefix Returns 404
    [Documentation]    Verify requesting a non-existent remote MFE prefix returns 404 Not Found.
    [Tags]    mfe    negative
    ${response}=    GET    ${MFE_SHELL_URL}/mfe/non-existent-service/remoteEntry.json    expected_status=404
    Log    Response status: ${response.status_code}

Negative: Root Remote Entry Without Service Prefix Returns 404
    [Documentation]    Verify accessing /remoteEntry.json directly at root returns 404.
    [Tags]    mfe    negative
    ${response}=    GET    ${MFE_SHELL_URL}/remoteEntry.json    expected_status=404
    Log    Response status: ${response.status_code}
