/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

#ifndef _PLUGIN_H
#define _PLUGIN_H

#include <map>
#include <string>
#include <vector>
#include <unistd.h>
//#include "tokenizer.h"

using namespace std;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%% Functions exported by this DLL
//%% Should always be only SetEventFunc and InvokeFunction
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// g++ requires extern "C" otherwise the names of SetEventFunc and InvokeFunction
// are mangled C++ style. MS Visual Studio doesn't seem to care though.
extern "C"
{
    typedef void (*SendPluginEv)( const char* szEvent, void* pContext );
    char* SetEventFunc(SendPluginEv funcPtr);
    char* InvokeFunction( const char* szCommand, void* pContext );
}

// JNEXT Framework function of the form:
// typedef void (*SendPluginEv)( const char* szEvent );
// used to notify JavaScript of an asynchronous event
extern SendPluginEv SendPluginEvent;

/////////////////////////////////////////////////////////////////////////
// Constants and methods common to all JNEXT extensions types
/////////////////////////////////////////////////////////////////////////
#define szERROR         "Error "
#define szOK            "Ok "

#define szDISPOSE       "Dispose"
#define szINVOKE        "InvokeMethod"
#define szCREATE        "CreateObj"

/////////////////////////////////////////////////////////////////////////
// Utility functions
/////////////////////////////////////////////////////////////////////////
string& g_trim( string& str );
void g_tokenize(const string& str,const string& delimiters, vector<string>& tokens);
char* g_str2static( const string& strRetVal );
void g_sleep( unsigned int mseconds );
bool g_unregisterObject( const string& strObjId, void* pContext );


/////////////////////////////////////////////////////////////////////////
// Abstract extension object
/////////////////////////////////////////////////////////////////////////
class JSExt
{
public:
    virtual ~JSExt() {};
    virtual string InvokeMethod( const string& strCommand ) = 0;
    virtual bool CanDelete( void ) = 0;
    virtual void TryDelete( void ) {}
public:
    void* m_pContext;
};

/////////////////////////////////////////////////////////////////////////
// Callback functions to be implemented by the plugin implementation
/////////////////////////////////////////////////////////////////////////
extern char* onGetObjList( void );
extern JSExt* onCreateObject( const string& strClassName, const string& strObjId );

#endif
