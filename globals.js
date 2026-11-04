import React from 'react';
import ReactDOM from 'react-dom/client';
import * as supabase from '@supabase/supabase-js';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
// The screens were written against CDN globals; keep those names available.
window.React = React;
window.ReactDOM = ReactDOM;
window.supabase = supabase;
window.htmlToImage = htmlToImage;
window.jspdf = { jsPDF };
