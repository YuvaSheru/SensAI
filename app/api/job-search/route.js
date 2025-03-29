import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { query, location } = await req.json();

    // You can integrate with various job search APIs here
    // For example: Indeed, LinkedIn, or other job boards
    // For now, we'll use a mock response
    const mockJobs = [
      {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: location || 'San Francisco, CA',
        description: 'We are looking for a talented Software Engineer to join our team...',
        posted_at: '2 days ago',
        url: 'https://example.com/job/1',
      },
      {
        title: 'Frontend Developer',
        company: 'Web Solutions',
        location: location || 'Remote',
        description: 'Join our team as a Frontend Developer and help build amazing user experiences...',
        posted_at: '1 day ago',
        url: 'https://example.com/job/2',
      },
      {
        title: 'Full Stack Developer',
        company: 'Startup Inc',
        location: location || 'New York, NY',
        description: 'Looking for a Full Stack Developer who can work with modern technologies...',
        posted_at: '3 days ago',
        url: 'https://example.com/job/3',
      },
    ].filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({ jobs: mockJobs });
  } catch (error) {
    console.error('Error searching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    );
  }
} 