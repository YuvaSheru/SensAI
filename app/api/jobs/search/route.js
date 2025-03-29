import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { 
      query, 
      location, 
      page = 1,
      category,
      contract_type,
      salary_min,
      salary_max,
      company,
      max_days_old,
      sort_by = 'date',
      experience_level,
      work_type
    } = await req.json();
    
    // Adzuna API configuration
    const APP_ID = 'd53293b1';
    const APP_KEY = 'ec6f2258267d28dad17d025cf9ff7e5b';
    const country = 'us';
    const baseUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;

    // Build URL with parameters
    const url = new URL(baseUrl);
    const params = new URLSearchParams();
    
    // Required parameters
    params.append('app_id', APP_ID);
    params.append('app_key', APP_KEY);
    params.append('results_per_page', '20');
    params.append('content-type', 'application/json');

    // Search parameters - ensure at least one search parameter is provided
    if (query) {
      params.append('what', query);
    } else if (category) {
      // If no query but category is provided, search for all jobs in that category
      params.append('what', category.replace(' Jobs', ''));
    }
    
    if (location) params.append('where', location);
    
    // Category mapping (Adzuna uses different category format)
    if (category) {
      const categoryMap = {
        'IT Jobs': 'it-jobs',
        'Engineering Jobs': 'engineering-jobs',
        'Healthcare & Nursing Jobs': 'healthcare-nursing-jobs',
        'Sales Jobs': 'sales-jobs',
        'Accounting & Finance Jobs': 'accounting-finance-jobs',
        'Teaching Jobs': 'teaching-jobs',
        'Admin Jobs': 'admin-jobs',
        'Marketing Jobs': 'marketing-jobs',
        'Scientific & QA Jobs': 'scientific-qa-jobs'
      };
      params.append('category', categoryMap[category] || '');
    }

    // Contract type
    if (contract_type) {
      if (contract_type === 'full_time' || contract_type === 'part_time') {
        params.append('full_time', contract_type === 'full_time' ? '1' : '0');
      }
      if (['permanent', 'contract', 'temporary', 'internship'].includes(contract_type)) {
        params.append('contract_type', contract_type);
      }
    }

    // Experience level - map to Adzuna's format
    if (experience_level) {
      const experienceMap = {
        'entry': 'entry_level',
        'mid': 'mid_level',
        'senior': 'senior_level',
        'lead': 'lead',
        'manager': 'manager',
        'director': 'director',
        'executive': 'executive'
      };
      params.append('experience_level', experienceMap[experience_level] || experience_level);
    }

    // Work type - map to Adzuna's format
    if (work_type) {
      const workTypeMap = {
        'remote': 'remote',
        'hybrid': 'hybrid',
        'onsite': 'onsite',
        'flexible': 'flexible'
      };
      params.append('work_type', workTypeMap[work_type] || work_type);
    }

    // Salary range - ensure both min and max are provided if either is
    if (salary_min > 0 || salary_max < 500000) {
      params.append('salary_min', Math.max(0, salary_min).toString());
      params.append('salary_max', Math.min(500000, salary_max).toString());
    }
    
    // Company name
    if (company) {
      params.append('company', company);
      // Also search in title/description as Adzuna's company search is strict
      params.append('what_and', company);
    }
    
    // Date posted
    if (max_days_old && max_days_old !== 30) {
      params.append('max_days_old', max_days_old.toString());
    }

    // Sorting
    if (sort_by) {
      const sortMap = {
        'date': 'date',
        'salary': 'salary',
        'relevance': 'relevance'
      };
      params.append('sort_by', sortMap[sort_by] || 'date');
    }

    // Append all parameters to URL
    url.search = params.toString();

    console.log('Fetching jobs from:', url.toString()); // Debug log

    const response = await fetch(url.toString());
    const responseText = await response.text();
    
    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse API response:', responseText);
      throw new Error('Invalid response from job search service');
    }
    
    if (!response.ok) {
      // Handle specific API error cases
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }
      if (data.error) {
        throw new Error(data.error);
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    if (!data || !Array.isArray(data.results)) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid response format from job search service');
    }

    // Process jobs and generate analytics
    const jobs = data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || 'Company Not Listed',
      location: job.location?.area?.join(', ') || job.location?.display_name || 'Location Not Specified',
      type: job.contract_time || job.contract_type || 'Not Specified',
      description: job.description,
      posted_at: job.created,
      url: job.redirect_url,
      salary: job.salary_min && job.salary_max 
        ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}/year`
        : job.salary_is_predicted === 1 
          ? `Est. $${Math.round(job.salary_min || job.salary_max).toLocaleString()}/year`
          : null,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_is_predicted: job.salary_is_predicted === 1,
      category: job.category?.label || category || null,
      contract_type: job.contract_type || contract_type || null,
      experience_level: job.experience_level || experience_level || null,
      work_type: job.work_type || work_type || null
    }));

    // Generate analytics
    const analytics = {
      categories: {},
      experienceLevels: {},
      workTypes: {},
      contractTypes: {}
    };

    jobs.forEach(job => {
      // Count categories
      if (job.category) {
        analytics.categories[job.category] = (analytics.categories[job.category] || 0) + 1;
      }

      // Count experience levels
      if (job.experience_level) {
        analytics.experienceLevels[job.experience_level] = (analytics.experienceLevels[job.experience_level] || 0) + 1;
      }

      // Count work types
      if (job.work_type) {
        analytics.workTypes[job.work_type] = (analytics.workTypes[job.work_type] || 0) + 1;
      }

      // Count contract types
      if (job.contract_type) {
        analytics.contractTypes[job.contract_type] = (analytics.contractTypes[job.contract_type] || 0) + 1;
      }
    });

    return NextResponse.json({
      jobs,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(data.count / 20),
        total_results: data.count,
        results_per_page: 20
      },
      analytics
    });

  } catch (error) {
    console.error('Error in job search API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to search jobs',
        message: error.message,
        jobs: [],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_results: 0,
          results_per_page: 20
        },
        analytics: {
          categories: {},
          experienceLevels: {},
          workTypes: {},
          contractTypes: {}
        }
      },
      { status: error.message.includes('Rate limit') ? 429 : 500 }
    );
  }
} 